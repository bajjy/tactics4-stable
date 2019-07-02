import { animationAvailable } from '../config.animationAvailable.js';

import { effectsAvailable } from '../config.effectsAvailable.js';
function transferUnit(input) {
    var actions = input.game.getAvailableActions();
    var unit = input.game.TurnMachine.who().units[0];
    var eff = input.game.findEffect({title: 'transfer'})[0];

    unit.getState().location = eff[0];
    
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

export {
    transferUnit
}