import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function fort(state) {
    var modificator = state.effectLocalSettings.fort ? state.effectLocalSettings.fort.amount : 0;
    var amount = effectGlobalSettings.fort.amount + modificator;

    state['chance'] ? state['chance'].push(amount) : state['chance'] = [amount];
    return true
};

export {
    fort
}