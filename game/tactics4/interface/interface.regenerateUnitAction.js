import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { effectInfo } from './interface.information.js';
import { checkStates } from './interface.checkStates.js';

var settings = effectGlobalSettings['regenerate'];

function init(input) {
    var unit = input.events.save.unit.getState();
    var yx = unit.location
    var search = input.game.search({
        search: unit.location.concat(yx),
        ignore: {
            unit: true
        }
    });
    var target = unit;

    input.view.purge('hud');
    input.events.save['regenerateUnitAction'] = true;

    effectInfo(input, input.events.save.action);

    input.view.add({
        type: 'map',
        map: {
            [`field_${yx[0]}_${yx[1]}`]: {
                sihdre: {
                    type: 'marker',
                    class: 'field',
                    render: input.view.getCell(yx)
                }
            }
        }
    });

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
                    target: `[data-sihdre-cell="1"][data-yx="${yx[0]},${yx[1]}"]`
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
                    target: `[data-sihdre-cell="1"][data-yx="${yx[0]},${yx[1]}"]`
                },
                text: ''
            }
            
        }
    });
    input.view.commit();
    input.view.draw();
    return hudAttackTarget(input);
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
    input.events.save['target'] = input.events.save.unit;

    //turn off hud
    input.view.purge();
    input.view.draw();

    actions.some(el => {
        if (el.title == 'regenerate') {
            return input.game.action({
                game: input.game,
                client: input.game.TurnMachine.who(),
                target: input.events.save.unit,
                task: el,
                setup: {
                    target: input.events.save.unit,
                    effectsMap: input.game.effects.map
                }
            });
        };
    });

    //renew interface
    changed += checkStates(input);
    if (!changed) return hudCancelSkill(input);
    input['changed'] = changed;
    input.game.animation.actor(() => {
        return hudCancelSkill(input);
    }, unit, 'interfaceRegenerateUnitAction', changed.timer);
};

function regenerateUnitAction(input) {
    if (!input.events.save.regenerateUnitAction) return init(input);
    // if (input.el.dataset.sihdreHudKey == 'cancelSkill') return hudCancelSkill(input);
    // if (input.el.dataset.sihdreHudKey == 'attackTarget') return hudAttackTarget(input);
};

export {
    regenerateUnitAction
}