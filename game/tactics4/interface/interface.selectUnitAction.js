import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { information } from './interface.information.js';
import { distribution } from './interface.distribution.js';

var yx;
var cell;
var unit;

function init(input) {
    let changed;

    input.events.save['selectUnitAction'] = true;

    for (let unit of input.game.TurnMachine.who().units) {
        let actions = input.game.getAvailableActions({
            index: unit.getState().index
        });
        let loc = unit.getState().location;
        if (actions.length > 1) {
            input.view.add({
                type: 'hud',
                hud: {
                    selectUnit: {
                        sihdre: {
                            type: 'hud',
                            class: 'menu selectUnitAction circle',
                            render: '',
                            target: '[data-kkey="hudActions"]',
                            offsetX: 1,
                            // render: input.view.getCell([loc[0], loc[1]]),
                            // target: `[data-sihdre-cell="1"][data-yx="${loc[0]},${loc[1]}"]`,
                            location: unit.getState().location
                        },
                        text: '',
                        info: {
                            sihdre: {
                                type: 'hud'
                            },
                            text: `
                                <strong>Select unit ${unit.getState().title}</strong>
                                <p>Select ${unit.getState().title} in ${unit.getState().location.join(', ')}</p>
                            `
                        }
                    }
                }
            });
        };
    };
    input.view.add({
        type: 'hud',
        hud: {
            actionPlayerFinishesTurn: {
                sihdre: {
                    type: 'hud',
                    class: 'menu actionPlayerFinishesTurn circle',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: 1
                },
                text: '',
                info: {
                    sihdre: {
                        type: 'hud'
                    },
                    text: `${input.game.TurnMachine.who().title} finish a turn`
                }
            }
        }
    });

    input.view.commit();
    return input.view.draw();
};

function unitSelection(input) {
    let changed;
    yx = input.location || input.el.dataset.yx.split(',');
    cell = input.view.getCell(yx);
    unit = cell['unit'];
    input.view.purge();

    if (unit && input.events.save.unit) {
        return hudCancelSelectUnit(input);
    };
    if (unit && !input.events.save.unit) {
        if (unit.getState().player == input.game.TurnMachine.who().index) {
            var actions = input.game.getAvailableActions({
                index: unit.getState().index
            });

            //rm hud
            input.view.purge();
            input.view.draw();

            input.events.save['unit'] = unit;

            information(input, `
                <strong>${unit.getState().title}</strong>
                <div>${unit.getState().status}, ${unit.getState().title}</div>
                <small>can do: ${unit.getState().actions.join(' / ')}</small>
            `);

            input.view.add({
                type: 'hud',
                hud: {
                    cancelSelectUnit: {
                        sihdre: {
                            type: 'hud',
                            class: 'menu cancelSelectUnit circle',
                            render: '',
                            target: '[data-kkey="hudActions"]',
                            offsetX: 1
                        },
                        text: '',
                        info: {
                            sihdre: {
                                type: 'hud'
                            },
                            text: effectGlobalSettings['cancelSelectUnit'].text()
                        }
                    }
                }
            });
            for (let [index, value] of actions.entries()) {
                input.view.add({
                    type: 'hud',
                    hud: {
                        [value.title]: {
                            sihdre: {
                                type: 'hud',
                                class: `menu ${value.title} circle`,
                                render: '',
                                target: '[data-kkey="hudActions"]',
                                offsetX: 1
                            },
                            text: '',
                            info: {
                                sihdre: {
                                    type: 'hud'
                                },
                                text: effectGlobalSettings[value.title].text()
                            }
                        }
                    }
                });
            };
            input.view.add({
                type: 'map',
                map: {
                    [`slectedUnit_${unit.getState().player}_${unit.getState().index}`]: {
                        sihdre: {
                            type: 'marker',
                            class: 'slectedUnit',
                            render: input.view.getRender().scene.map[`unit_${unit.getState().player}_${unit.getState().index}`],
                            unit: unit
                        }
                    }
                }
            });

            if (!input.location) input['location'] = yx;
            changed = animationAvailable.zoomToPoint(input, `unit_${unit.getState().player}_${unit.getState().index}`); //, settings.zoomToPoint
            input['changed'] = changed || 0;

            input.view.commit();

            if (!changed) return input.view.draw();

            input.game.animation.actor(() => {
                input.view.draw();
            }, {}, false);
        };
        return console.log(`this ${unit.getState().title} is not selectable`);
    };
    console.log(`no unit in ${yx.join(', ')}`);
};

function hudSelectUnit(input) {
    input.location = input.view.getRender().hud[input.el.dataset.kkey].sihdre.location;
    return unitSelection(input);
};
function hudCancelSelectUnit(input) {
    delete input.events.save.unit;
    input.view.purge();
    init(input);
};
function hudPlayerFinishesTurn(input) {
    var actions = input.game.getAvailableActions();

    actions.some(el => {
        if (el.title == 'actionPlayerFinishesTurn') {
            input.game.action({
                game: input.game,
                client: input.game.TurnMachine.who(),
                target: input.game.TurnMachine.who(),
                task: el,
                setup: {}
            });
            //exit point
            input.view.purge();
            input.view.draw();
            input.events.save = {};
            input.events.setState('distribution');
        };
    });
};

function selectUnitAction(input) {
    //entry point
    if (!input.events.save.selectUnitAction) return init(input);
    if (input.el.dataset.sihdreCell) return unitSelection(input);
    if (input.el.dataset.sihdreHudKey == 'selectUnit') return hudSelectUnit(input);
    if (input.el.dataset.sihdreHudKey == 'actionPlayerFinishesTurn') return hudPlayerFinishesTurn(input);
    if (input.el.dataset.sihdreHudKey == 'cancelSelectUnit') return hudCancelSelectUnit(input);

    return distribution(input);
};

export {
    selectUnitAction
}