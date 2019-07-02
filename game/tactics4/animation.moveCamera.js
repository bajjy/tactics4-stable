import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['animationMoveCamera'];
var style = document.createElement('style');

style.id = 'animationMoveCamera';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms ease-out;
    }
`;

function moveCamera(input, axis = {}) {
    let camera = input.view.getRender().scene.sihdre.data;

    document.querySelector('head').appendChild(style);

    for (let key in axis) {
        let value = axis[key]
        for (let kkey in value) {
            camera.axis[key][kkey] += value[kkey];
        };
    };

    input.view.draw(true);

    setTimeout(() => {
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, settings.speed);
    return {
        timer: settings.speed
    }
};
export {
    moveCamera
}