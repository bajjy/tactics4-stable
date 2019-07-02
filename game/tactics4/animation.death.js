import { animationAvailable } from '../config.animationAvailable.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';
import { particleUnconscious } from '../particle/particle.unconscious.js';

var settings = animationGlobalSettings['death'];
var settingsUnconscious = animationGlobalSettings['unconscious'];
var unitDefaults;
var style = document.createElement('style');
var unitStart;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationDeath';
    style.innerHTML = `
        [data-kkey=${modelClass}].animation.death {
            transform: ${unitStart};
            animation: ${modelClass}death ${settings.speed}ms ease-in 1 forwards;
        }
        @keyframes ${modelClass}death {
            0% {
                transform: ${unitStart}
            }
            50% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate - 10}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);
            }
            100% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate - 50}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);
            }
        }
    `;
};
function kill(input) {
    var target = input.events.save.target;
    var targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`];
    modelClass = `unit_${target.getState().player}_${target.getState().index}`;

    //zero animation step. model before turn over
    unitDefaults = targetModel.sihdre.data.axis;
    unitStart = `translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);`
    //now set all animation steps according to position
    unitDefaults = targetModel.sihdre.data.axis;
    appendstyle();

    targetModel.sihdre.class = 'animation death';
    //input.view.draw(); //commented because of double animation
    document.querySelector('head').appendChild(style);
    particleUnconscious(input);

    input.game.animation.actor(() => {
        delete targetModel.sihdre.class;
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, targetModel.sihdre, 'deathStyles', settings.speed);
    return {
        timer: settings.speed
    }
};
function death(input) {
    var target = input.events.save.target;
    var targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`];

    if (targetModel.sihdre.class && targetModel.sihdre.class.includes('unconscious')) return kill(input);
    animationAvailable.unconscious(input);
    input.game.animation.actor(() => {
        input.events.save.target = target;
        kill(input);
    }, targetModel.sihdre, 'deathStyles', settingsUnconscious.speed);
    return {
        timer: settingsUnconscious.speed + settings.speed
    }
};

export {
    death
}