import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function mountain(state) {
    var modificator = state.effectLocalSettings.slow ? state.effectLocalSettings.slow.amount : 0;
};

export {
    mountain
}