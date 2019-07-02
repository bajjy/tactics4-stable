import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function actionPlayerFinishesTurn(state) {
    var game = state.game;
    var effectsMap = game.effects.map;

    for (let unit of game.TurnMachine.who().units) {
        let y = unit.getState().location[0];
        let x = unit.getState().location[1];

        effectsMap[y][x].map(effect => {
            state['effect'] = effect;
            if (effectGlobalSettings.actionPlayerFinishesTurn.reacts.indexOf(effect.title) == -1) return false;
            if (effect.action(state)) effect.affected.push(state);
        });
        delete state.effect;
    };

    for (let [key, value] of game.effects.list) {
        value.map(effect => {
            console.log(effect.setup)
            
            state['effect'] = effect;
            if (effectGlobalSettings.actionPlayerFinishesTurn.autorun.indexOf(effect.title) == -1) return false;
            if (effect.action(state)) effect.affected.push(state);
        });
        delete state.effect;
    };
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log(game.TurnMachine.who())
    game.TurnMachine.next();
    console.log(game.TurnMachine.who())
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^');
};

export {
    actionPlayerFinishesTurn
}