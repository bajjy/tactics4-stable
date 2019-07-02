import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function shot(state) {
    var amountMod = state.effectLocalSettings.shot ? state.effectLocalSettings.shot.amount : 0;
    var chanceMod = state.effectLocalSettings.shot ? state.effectLocalSettings.shot.chance : 0;
    var amount = effectGlobalSettings.shot.amount + amountMod;
    var chance = effectGlobalSettings.shot.chance + chanceMod;
    var effectsMap = state.game.effects.map;
    var y = state.location[0];
    var x = state.location[1];
    var dice = state.game.dice(state).amount;

    state['amount'] = amount;
    state['chance'] = [chance];

    if (effectGlobalSettings.shot.nochance.some(hp => hp == state.status)) return state.hp -= amount;
    effectsMap[y][x].map(effect => {
        if (effectGlobalSettings.shot.reacts.indexOf(effect.title) == -1) return false;
        state['effect'] = effect;
        if (effect.action(state)) {
            effect.affected.push(state)
        };
    });

    chance = state['chance'].reduce((a, b) => a + b, 0);
    if (dice <= chance) state.hp -= amount;
};

export {
    shot
}