import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';
import { particleThrust } from '../particle/particle.thrust.js';

var settings = animationGlobalSettings['thrust'];
var unitDefaults;
var targetDefaults;
var style = document.createElement('style');
var unitStart;
var dir = 10;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationThrust';
    style.innerHTML = `
        [data-kkey=${modelClass}].animation.thrust {
            transform: ${unitStart};
            animation: ${modelClass}thrust ${settings.speed}ms ease-in 1;
        }
        @keyframes ${modelClass}thrust {
            0% {
                transform: ${unitStart}
            }
            15% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);
            }
            25% {
                transform: translate3d(${unitDefaults.x.translate + dir}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle + 5}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle + 5}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle - dir}deg);
            }
            70% {
                transform: translate3d(${unitDefaults.x.translate + dir}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle + 5}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle + 5}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle - dir}deg);
            }
        }
    `;
};
function thrust(input) {
    var unit = input.events.save.unit;
    var target = input.events.save.target;
    var unitModel = input.game.view.getRender().scene.map[`unit_${unit.getState().player}_${unit.getState().index}`];
    var targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`];
    modelClass = `unit_${target.getState().player}_${target.getState().index}`;

    let x1 = unitModel.sihdre.data.axis.x.translate;
    let x2 = targetModel.sihdre.data.axis.x.translate;
    let y1 = unitModel.sihdre.data.axis.y.translate;
    let y2 = targetModel.sihdre.data.axis.y.translate;
    let angle = Math.atan2( (y1 - y2), (x1 - x2) ) * (180 / Math.PI);

    //zero animation step. model before turn over
    unitDefaults = unitModel.sihdre.data.axis;
    unitStart = `translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);`
    //now set all animation steps according to position
    unitModel.sihdre.data.axis.z.angle -= unitModel.sihdre.data.axis.z.angle - angle;
    dir = unitModel.sihdre.data.axis.z.angle <= 0 ? -10 : 10;
    unitDefaults = unitModel.sihdre.data.axis;
    appendstyle();

    unitModel.sihdre.class = 'animation thrust';
    input.view.draw();
    document.querySelector('head').appendChild(style);
    particleThrust(input);

    input.game.animation.actor(() => {
        delete unitModel.sihdre.class;
        input.game.view.draw();
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, unitModel.sihdre, 'thrustStyles', settings.speed);
    return {
        timer: settings.speed
    }
};

export {
    thrust
}