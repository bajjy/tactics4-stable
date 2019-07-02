import { animationAvailable } from '../config.animationAvailable.js';
import { effectInfo } from './interface.information.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

var settings = effectGlobalSettings['move'];

function init(input) {
    
    var unit = input.events.save.unit.getState();
    var area = input.game.land.around({yx: unit.location, radius: unit.speed});

    input.view.purge();
    input.events.save['moveUnitAction'] = true;
    input.events.save['area'] = area;

    effectInfo(input, input.events.save.action);

    area.map(cell => {
        input.view.add({
            type: 'map',
            map: {
                [`field_${cell[0]}_${cell[1]}`]: {
                    sihdre: {
                        type: 'marker',
                        class: 'field',
                        render: input.view.getCell(cell),
                        unit: unit
                    }
                }
            }
        });
    });
    input.view.add({
        type: 'hud',
        hud: {
            cancelSkill: {
                sihdre: {
                    type: 'hud',
                    class: 'menu cancel circle',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: 1
                },
                text: ''
            }
            
        }
    });
    input.view.commit();
    return input.view.draw();
};
function movePathfind(input) {
    var unit = input.events.save.unit.getState();
    var yx = input.location || input.el.dataset.yx.split(',');
    var search = input.game.search({
        search: input.events.save.unit.getState().location.concat(yx),
        ignore: {
            unit: true,
            effect: false
        }
    });
    var cellBeforelast;
    var cellLast;
    var blockers = false;

    input.view.purge();
    init(input);

    if (search.length > unit.speed) search.length = unit.speed;
    
    //cancel skill if own position
    if (unit.location[0] == yx[0] && unit.location[1] == yx[1]) return hudCancelSkill(input);
    //not select if there is a unit
    if (input.view.getCell(yx)['unit']) return false;
    //not if there is an endBlocker
    input.game.effects.map[yx[0]][yx[1]].map(eff => {
        if (settings.endBlockers.indexOf(eff.title) > -1) blockers = true;
    });

    if (blockers) return false;
    //if somehow trere is not available path
    if (search.length == 0) return false;

    input.events.save['search'] = search;

    search.map(cell => {
        input.view.add({
            type: 'map',
            map: {
                [`path_${cell.x}_${cell.y}`]: {
                    sihdre: {
                        type: 'marker',
                        class: 'path',
                        render: input.view.getCell([cell.x, cell.y]),
                        unit: unit
                    }
                }
            }
        });
    });

    cellBeforelast = search.length > 1 ? search[search.length - 2] : search[0]; //cell beforelast
    cellLast = search.length > 1 ? search[search.length - 1] : search[0]; //cell beforelast

    input.game.players.list.map((currentPlayer, pIndex) => {
        currentPlayer.units.map((currentUnit, uIndex) => {
            var currTarget = currentUnit.getState().location;
            //if (currTarget[0] == cellBeforelast.x && currTarget[1] == cellBeforelast.y) blockers = true;
            if (currentPlayer.kind == 'ai' && currTarget[0] == cellLast.x && currTarget[1] == cellLast.y) blockers = true;
        });
    });

    if (blockers) return false;

    input.view.add({
        type: 'hud',
        hud: {
            moveByPath: {
                sihdre: {
                    type: 'hud',
                    class: 'menu ok circle',
                    render: '',
                    target: `[data-sihdre-cell="1"][data-yx="${search[search.length - 1].x},${search[search.length - 1].y}"]`
                },
                text: ''
            }
        }
    });
    input.view.add({
        type: 'hud',
        hud: {
            cancelSkill: {
                sihdre: {
                    type: 'hud',
                    class: 'menu cancel circle',
                    render: '',
                    target: `[data-sihdre-cell="1"][data-yx="${search[search.length - 1].x},${search[search.length - 1].y}"]`
                },
                text: ''
            }
            
        }
    });
    //map marker with action
    // input.view.add({
    //     type: 'map',
    //     map: {
    //         [`moveByPath`]: {
    //             sihdre: {
    //                 type: 'hudMarker',
    //                 class: 'moveByPathOk',
    //                 settings: 'default',
    //                 render: input.view.getCell([search[search.length - 1].x, search[search.length - 1].y]),
    //                 unit: unit
    //             }
    //         }
    //     }
    // });

    //redraw area after purge
    input.events.save.area.map(cell => {
        input.view.add({
            type: 'map',
            map: {
                [`field_${cell[0]}_${cell[1]}`]: {
                    sihdre: {
                        type: 'marker',
                        class: 'field',
                        render: input.view.getCell(cell),
                        unit: unit
                    }
                }
            }
        });
    });
    input.view.commit();
    return input.view.draw();
}
function hudCancelSkill(input) {
    //exit point
    input.view.purge();
    input.events.save = {};
    input.events.setState('distribution');
};
function hudMoveByPath(input) {
    var actions = input.game.getAvailableActions({
        index: input.events.save.unit.getState().index
    });
    var unit = input.events.save.unit.getState();
    var model = input.view.getRender().scene.map[`unit_${unit.player}_${unit.index}`];
    var changed;

    //turn off hud
    input.view.purge();
    input.view.draw();

    actions.some(el => {
        if (el.title == 'move') {
            return input.game.action({
                game: input.game,
                client: input.game.TurnMachine.who(),
                target: input.events.save.unit,
                task: el,
                setup: {
                    path: input.events.save.search,
                    effectsMap: input.game.effects.map
                }
            });
        };
    });

    changed = animationAvailable.movement(input, model);

    //renew interface
    if (!changed) return hudCancelSkill(input);
    input['changed'] = changed;
    input.game.animation.actor(() => {
        return hudCancelSkill(input);
    }, unit, 'interfaceMoveUnitAction', changed.timer);
};

function moveUnitAction(input) {
    //entry point
    if (!input.events.save.moveUnitAction) return init(input);
    if (input.el.dataset.sihdreCell) return movePathfind(input);
    if (input.el.dataset.sihdreHudKey == 'cancelSkill') return hudCancelSkill(input);
    if (input.el.dataset.sihdreHudKey == 'moveByPath') return hudMoveByPath(input);
};

export {
    moveUnitAction
}