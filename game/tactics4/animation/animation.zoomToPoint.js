import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['zoomToPoint'];
var style = document.createElement('style');

style.id = 'animationZoomToPoint';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms ease-out;
    }
`;

function zoomToPoint(input, target, axis = {}) {
    let camera = input.view.getRender().scene.sihdre.data;
    let point = input.view.getRender().scene.map[target].sihdre.data;
    let yPos = input.location[1];
    let camXtranslateBefore = camera.axis.x.translate;

    axis = settings.axis;
    document.querySelector('head').appendChild(style);

    camera.connect(point);
    camera.connection();

    if (camXtranslateBefore == camera.axis.x.translate) {
        document.querySelector('#' + style.id).remove();
        return {
            timer: 0
        }
    };

    for (let key in axis) {
        let value = axis[key]
        for (let kkey in value) {
            camera.axis[key][kkey] = value[kkey];
        };
    };

    if (yPos < 2) camera.axis.y.translate += settings.CamTranslateYCorr;
    if (yPos < 2) camera.axis.z.translate = settings.CamTranslateXCorr;
    input.view.draw(true);

    input.game.animation.actor(() => {
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, {}, false, settings.speed);
    return {
        timer: settings.speed
    }
};
export {
    zoomToPoint
}