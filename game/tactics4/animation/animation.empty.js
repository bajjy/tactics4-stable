import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['empty'];
var style = document.createElement('style');

function empty(input, target, axis = {}) {

    return {
        timer: settings.speed
    }
};
export {
    empty
}