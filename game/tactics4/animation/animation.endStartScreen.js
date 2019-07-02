import { animationGlobalSettings } from '../config.animationGlobalSettings.js';
import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';

var settings = animationGlobalSettings['endStartScreen'];
var style = document.createElement('style');
var unitDefaults;
var unitStart;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationEndStartScreen';
    style.innerHTML = `
        [data-kkey=${modelClass}] {
            animation: ${modelClass}endStartScreen ${settings.speed}ms ease-in-out 1 forwards;
        }
        @keyframes ${modelClass}endStartScreen {
            0% {
                transform: ${unitStart};
            }

            100% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate + 600}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle - 2}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);
            }
        }
        [data-kkey=${modelClass}] [data-model="model"]{
            animation: ${modelClass}endStartScreenModel ${settings.speed}ms ease-in-out 1 forwards;
        }
        @keyframes ${modelClass}endStartScreenModel {
            0% {
                background-color: transparent;
            }

            100% {
                background-color: black;
            }
        }
    `;
};

function endStartScreen(input) {
    let bg = input.view.getRender().scene.map.bg.sihdre.data;
    modelClass = 'bg';

    unitDefaults = bg.axis;
    unitStart = `translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);`

    appendstyle();

    document.querySelector('head').appendChild(style);
    input.view.draw();
    input.game.animation.actor(() => {
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, bg, 'endStartScreenStyles', settings.speed);
    return {
        timer: settings.speed
    }
};
export {
    endStartScreen
}