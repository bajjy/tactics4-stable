import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function thrust(state) {
    var amountMod = state.effectLocalSettings.thrust ? state.effectLocalSettings.thrust.amount : 0;
    var chanceMod = state.effectLocalSettings.thrust ? state.effectLocalSettings.thrust.chance : 0;
    var amount = effectGlobalSettings.thrust.amount + amountMod;
    var chance = effectGlobalSettings.thrust.chance + chanceMod;
    var effectsMap = state.game.effects.map;
    var y = state.location[0];
    var x = state.location[1];
    var dice = state.game.dice(state).amount;

    state['amount'] = amount;
    state['chance'] = [chance];

    if (effectGlobalSettings.thrust.nochance.some(hp => hp == state.status)) return state.hp -= amount;
    effectsMap[y][x].map(effect => {
        if (effectGlobalSettings.thrust.reacts.indexOf(effect.title) == -1) return false;
        state['effect'] = effect;
        if (effect.action(state)) {
            effect.affected.push(state)
        };
    });

    chance = state['chance'].reduce((a, b) => a + b, 0);
    if (dice <= chance) state.hp -= amount;
};

export {
    thrust
}