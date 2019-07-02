import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { effectInfo } from './interface.information.js';
import { checkStates } from './interface.checkStates.js';

var settings = effectGlobalSettings['shot'];

function init(input) {
    var area = input.game.land.around({
        yx: input.events.save.unit.getState().location,
        radius: settings.radius
    });

    input.view.purge('hud');
    input.events.save['shotUnitAction'] = true;
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
                        render: input.view.getCell(cell)
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

function selectTarget(input) {
    var unit = input.events.save.unit.getState();
    var yx = input.location || input.el.dataset.yx.split(',');
    var search = input.game.search({
        search: unit.location.concat(yx),
        ignore: {
            unit: true,
            effect: true
        }
    });
    var target = input.view.getCell(yx)['unit'];
    var blockers = false;
    search.map(cell => {
        input.game.effects.map[cell.x][cell.y].map(eff => {
            if (settings.blockers.indexOf(eff.title) > -1) blockers = true;
        });
    });

    if (blockers) return console.log('blocked');
    if (!target) return console.log('no unit');

    input.events.save['target'] = target;
    search.map(cell => {
        input.view.add({
            type: 'map',
            map: {
                [`path_${cell.x}_${cell.y}`]: {
                    sihdre: {
                        type: 'marker',
                        class: 'target',
                        render: input.view.getCell([cell.x, cell.y]),
                        unit: unit
                    }
                }
            }
        });
    });
    input.view.add({
        type: 'hud',
        hud: {
            attackTarget: {
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

    input.view.commit();
    return input.view.draw();
};

function hudCancelSkill(input) {
    //exit point
    input.view.purge();
    input.events.save = {};
    input.events.setState('distribution');
};
function hudAttackTarget(input) {
    var unit = input.events.save.unit.getState();
    var actions = input.game.getAvailableActions({
        index: unit.index
    });
    var changed;

    //turn off hud
    input.view.purge();
    input.view.draw();

    actions.some(el => {
        if (el.title == 'shot') {
            return input.game.action({
                game: input.game,
                client: input.game.TurnMachine.who(),
                target: input.events.save.target,
                task: el,
                setup: {
                    path: input.events.save.search,
                    effectsMap: input.game.effects.map
                }
            });
        };
    });

    changed = animationAvailable.thrust(input);

    //renew interface
    changed += checkStates(input);
    if (!changed) return hudCancelSkill(input);
    input['changed'] = changed;
    input.game.animation.actor(() => {
        return hudCancelSkill(input);
    }, unit, 'interfaceShotUnitAction', changed.timer);
};

function shotUnitAction(input) {
    if (!input.events.save.shotUnitAction) return init(input);
    if (input.el.dataset.sihdreCell) return selectTarget(input);
    if (input.el.dataset.sihdreHudKey == 'cancelSkill') return hudCancelSkill(input);
    if (input.el.dataset.sihdreHudKey == 'attackTarget') return hudAttackTarget(input);
};

export {
    shotUnitAction
}