import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['resurrect'];
var targetDefaults;
var style = document.createElement('style');
var targetStart;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationResurrect';
    style.innerHTML = `
        [data-kkey=${modelClass}].animation.resurrect {
            transform: ${targetStart};
            animation: ${modelClass}resurrect ${settings.speed}ms ease-in 1 forwards;
        }
        @keyframes ${modelClass}resurrect {
            0% {
                transform: ${targetStart}
            }
            15% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle - targetDefaults.x.angle / 4}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            50% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle - targetDefaults.x.angle / 2}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            100% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle - targetDefaults.x.angle}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
        }
    `;
};
function resurrect(input) {
    var target = input.events.save.target;
    var targetModel;
    modelClass = `unit_${target.getState().player}_${target.getState().index}`;
    targetModel = input.game.view.getRender().scene.map[modelClass];

    //zero animation step. model before turn over
    targetDefaults = targetModel.sihdre.data.axis;
    targetStart = `translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) rotate3d(1, 0, 0, ${targetDefaults.x.angle}deg) rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);`

    targetDefaults = targetModel.sihdre.data.axis;
    appendstyle();

    targetModel.sihdre.class = 'animation resurrect';
    input.view.draw();
    document.querySelector('head').appendChild(style);

    targetDefaults.x.angle = 0;
    input.game.animation.actor(() => {
        targetModel.sihdre.class = 'resurrect';
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
        input.view.draw();
    }, targetModel.sihdre, 'resurrectStyles', settings.speed);

    return {
        timer: settings.speed
    }
};

export {
    resurrect
}