import { setupCam } from './interface.setupCam.js';
import { information } from './interface.information.js';
import { advice } from './interface.information.js';
import { aiActivation } from './interface.aiActivation.js';
import { selectUnitAction } from './interface.selectUnitAction.js';
import { level1GlobalState } from './interface.level1GlobalState.js';
import { actionAvailable } from '../module.level1.actionAvailable.js';

var times = 0
function distribution(input) {
    //if effect has special animation
    //checkEffect(input);

    console.log('DISTRIBUTION')
    console.log(input.game.TurnMachine.who())

    //switch game state
    if (level1GlobalState(input)) return false;

    //setup screen only for first time
    if (input.events.save.startScreen) setupCam(input);

    //show advices
    if ((input.location && !input.events.save.advice) || (input.el && input.el.dataset.yx && !input.events.save.advice)) {
        advice(input);
        input.events.save.advice = true
    };
    if (input.events.save.advice) delete input.events.save.advice;

    //draw info signs
    information(input);

    //check if current player is AI and pass interface to him
    if (input.events.save && !input.events.save.aiActivation) aiActivation(input);

    //if recursion occured
    if (times > 100) return false;
    ++times;
    //click on icons
    if (input.el && actionAvailable[input.el.dataset.sihdreHudKey]) {
        input.events.save.action = input.el.dataset.sihdreHudKey;
        return input.events.setState( actionAvailable[input.el.dataset.sihdreHudKey] )
    };

    //next player
    selectUnitAction(input);

    input.events.setEvent({
        type: 'mousedown'
    });
    times = 0;
};

export {
    distribution
}