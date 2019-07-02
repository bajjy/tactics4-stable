import { animationGlobalSettings } from '../config.animationGlobalSettings.js';
import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';

var settings = animationGlobalSettings['endScreenCam'];
var style = document.createElement('style');
var unitDefaults;
var unitEnd;
var modelClass;

function appendstyle() {
    style.id = modelClass + 'animationEndScreenCam';
    style.innerHTML = `
        [data-kkey=${modelClass}] {
            transform: ${unitEnd};
            animation: ${modelClass}endScreenCam ${settings.speed}ms ease-in-out infinite;
        }
        @keyframes ${modelClass}endScreenCam {
            0% {
                transform: ${unitEnd}
            }
            25% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate + 10}px, ${unitDefaults.z.translate + 10}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle + 2}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle + 5}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle - 1}deg);
            }
            50% {
                transform: ${unitEnd}
            }
            75% {
                transform: translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate + 5}px, ${unitDefaults.z.translate + 5}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle - 2}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle - 5}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle + 5}deg);
            }
        }
    `;
};

function endScreenCam(input) {
    let camera = input.view.getRender().scene.sihdre.data;
    let bg = input.view.getRender().scene.map.bg.sihdre.data;
    let unitModel = input.view.getRender().scene.map.bg;
    let axis = {
        camera: settings.camera.axis,
        bg: settings.bg.axis
    };
    modelClass = 'bg';

    for (let key in axis.camera) {
        let value = axis.camera[key]
        for (let kkey in value) {
            camera.axis[key][kkey] = value[kkey];
        };
    };
    for (let key in axis.bg) {
        let value = axis.bg[key]
        for (let kkey in value) {
            bg.axis[key][kkey] = value[kkey];
        };
    };

    camera.axis.x.translate += camera.size.width / 2;
    camera.axis.y.translate += camera.size.height / 2;
    bg.size.width = camera.size.width * 2;
    bg.size.height = camera.size.height * 2;
    bg.axis.x.translate = -camera.size.width;
    bg.axis.y.translate = -camera.size.height;
    if (camera.size.height <= graphicsGlobalSettings.medias.mobile) bg.axis.y.translate = camera.size.height / 2;
    bg.axis.z.translate = 300;

    unitDefaults = bg.axis;
    unitEnd = `translate3d(${unitDefaults.x.translate}px, ${unitDefaults.y.translate}px, ${unitDefaults.z.translate}px) rotate3d(1, 0, 0, ${unitDefaults.x.angle}deg) rotate3d(0, 1, 0, ${unitDefaults.y.angle}deg) rotate3d(0, 0, 1, ${unitDefaults.z.angle}deg);`

    appendstyle();

    document.querySelector('head').appendChild(style);
    input.view.draw();
    return {
        timer: settings.speed
    }
};
export {
    endScreenCam
}