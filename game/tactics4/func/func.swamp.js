import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function swamp(state) {
    var modificator = state.effectLocalSettings.swamp ? state.effectLocalSettings.swamp.amount : 0;
    var amount = effectGlobalSettings.swamp.amount;

    state['swamp'] = [state.step, amount + 1];
    state.track.length = state.step + amount + 1;
    state.path = state.path.splice(state.step, amount + 1);
    state.track = state.track.concat(state.path);

    return true
};

export {
    swamp
}