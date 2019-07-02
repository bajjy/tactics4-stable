import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function epicMessage(state) {
    var modificator = state.effectLocalSettings.epicMessage ? state.effectLocalSettings.epicMessage.text : '';
    var text = effectGlobalSettings.epicMessage.text;
    state.epicMessage = text + modificator;
    console.log(state.epicMessage);
};

export {
    epicMessage
}