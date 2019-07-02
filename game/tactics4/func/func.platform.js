import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function platform(state) {
    var modificator = state.effectLocalSettings.platform ? state.effectLocalSettings.platform.amount : 0;
    var amount = effectGlobalSettings.platform.amount + modificator;

    state['chance'] ? state['chance'].push(amount) : state['chance'] = [amount];
    return true
};

export {
    platform
}