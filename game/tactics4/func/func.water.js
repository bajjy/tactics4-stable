import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function water(state) {
    var modificator = state.effectLocalSettings.water ? state.effectLocalSettings.water.amount : 0;
};

export {
    water
}