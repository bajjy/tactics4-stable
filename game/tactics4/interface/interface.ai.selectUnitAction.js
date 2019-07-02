import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { information } from './interface.information.js';
import { distribution } from './interface.distribution.js';

var yx;
var cell;
var unit;

function init(input) {
    input.events.save['selectUnitAction'] = true;
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
function aihudPlayerFinishesTurn(input) {
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

function aiSelectUnitAction(input) {
    //entry point
    if (!input.events.save.selectUnitAction) return init(input);
    if (input.el.dataset.sihdreCell) return unitSelection(input);
    if (input.el.dataset.sihdreHudKey == 'selectUnit') return hudSelectUnit(input);
    if (input.el.dataset.sihdreHudKey == 'aiactionPlayerFinishesTurn') return aihudPlayerFinishesTurn(input);
    if (input.el.dataset.sihdreHudKey == 'cancelSelectUnit') return hudCancelSelectUnit(input);
    return distribution(input);
};

export {
    aiSelectUnitAction
}