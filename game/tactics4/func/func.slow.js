import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function slow(state) {
    var modificator = state.effectLocalSettings.slow ? state.effectLocalSettings.slow.amount : 0;
    var amount = effectGlobalSettings.slow.amount;

    state['slow'] = [state.step, amount + 1];
    state.track.length = state.step + amount + 1;
    state.path = state.path.splice(state.step, amount + 1);
    state.track = state.track.concat(state.path);

    return true
};

export {
    slow
}