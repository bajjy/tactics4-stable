import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['transfer'];
var style = document.createElement('style');
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationTransfer';
    style.innerHTML = `
        [data-kkey=${modelClass}] {
            opacity: 0;
            animation: ${modelClass}transfer ${settings.speed}ms ease-in 1 forwards;
        }
        @keyframes ${modelClass}transfer {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
};

function transfer(input) {
    modelClass = 'scene';
    var unitModel = input.game.view.getRender().scene;
    unitModel.sihdre.class = 'animation thrust';
    input.game.view.draw();
    appendstyle();
    document.querySelector('head').appendChild(style);
    input.game.animation.actor(() => {
        input.game.view.draw();
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, {}, 'transferStyles', settings.speed);
    return {
        timer: settings.speed
    }
};

export {
    transfer
}