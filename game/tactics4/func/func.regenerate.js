import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function regenerate(state) {
    var amountMod = state.effectLocalSettings.regenerate ? state.effectLocalSettings.regenerate.amount : 0;
    var amount = effectGlobalSettings.regenerate.amount + amountMod;
    var effectsMap = state.game.effects.map;
    var y = state.location[0];
    var x = state.location[1];
    var unit = state.target;

    state['amount'] = amount;

    if (effectGlobalSettings.regenerate.disabled.some(dis => dis != state.status)) return state.hp += amount;

    effectsMap[y][x].map(effect => {
        if (effectGlobalSettings.regenerate.reacts.indexOf(effect.title) == -1) return false;
        state['effect'] = effect;
        if (effect.action(state)) {
            effect.affected.push(state)
        };
    });

    return true
};

export {
    regenerate
}