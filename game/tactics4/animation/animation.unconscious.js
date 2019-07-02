import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';
import { particleUnconscious } from '../particle/particle.unconscious.js';

var settings = animationGlobalSettings['unconscious'];
var plusOrMinus = Math.round(Math.random()) * 2 - 1;
var angle = (settings.angle + Math.random() * 10) * plusOrMinus;
var targetDefaults;
var style = document.createElement('style');
var targetStart;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationUnconscious';
    style.innerHTML = `
        [data-kkey=${modelClass}].animation.unconscious {
            transform: ${targetStart};
            animation: ${modelClass}unconscious ${settings.speed}ms ease-in 1 forwards;
        }
        @keyframes ${modelClass}unconscious {
            0% {
                transform: ${targetStart}
            }
            15% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle / 4}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            50% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle / 2}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            80% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            90% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle + 10}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            95% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle -5}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
            100% {
                transform: translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) 
                rotate3d(1, 0, 0, ${targetDefaults.x.angle + angle}deg) 
                rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) 
                rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);
            }
        }
    `;
};
function unconscious(input) {
    var target = input.events.save.target;
    var targetModel;
    modelClass = `unit_${target.getState().player}_${target.getState().index}`;
    targetModel = input.game.view.getRender().scene.map[modelClass];

    //zero animation step. model before turn over
    targetDefaults = targetModel.sihdre.data.axis;
    targetStart = `translate3d(${targetDefaults.x.translate}px, ${targetDefaults.y.translate}px, ${targetDefaults.z.translate}px) rotate3d(1, 0, 0, ${targetDefaults.x.angle}deg) rotate3d(0, 1, 0, ${targetDefaults.y.angle}deg) rotate3d(0, 0, 1, ${targetDefaults.z.angle}deg);`

    targetDefaults = targetModel.sihdre.data.axis;
    appendstyle();

    targetModel.sihdre.class = 'animation unconscious';
    input.view.draw();
    document.querySelector('head').appendChild(style);
    particleUnconscious(input);

    targetDefaults.x.angle = targetDefaults.x.angle + angle
    input.game.animation.actor(() => {
        targetModel.sihdre.class = 'unconscious';
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
        input.view.draw();
    }, targetModel.sihdre, 'unconsciousStyles', settings.speed);

    return {
        timer: settings.speed
    }
};

export {
    unconscious
}