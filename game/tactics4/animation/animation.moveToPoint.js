import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['moveToPoint'];
var style = document.createElement('style');

style.id = 'animationMoveToPoint';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms ease-out;
    }
`;

function moveToPoint(input, target, axis = {}) {
    let camera = input.view.getRender().scene.sihdre.data;
    let point = input.view.getRender().scene.map[target].sihdre;

    axis = settings.axis;
    document.querySelector('head').appendChild(style);


    camera.connect(point.data);
    camera.connection();

    for (let key in axis) {
        let value = axis[key]
        for (let kkey in value) {
            camera.axis[key][kkey] = value[kkey];
        };
    };

    input.view.draw(true);

    console.log(input)
    input.game.animation.actor(() => {
        if (document.querySelector('#' + style.id)) document.querySelector('#' + style.id).remove();
    }, {}, false, settings.speed);
    return {
        timer: settings.speed
    }
};
export {
    moveToPoint
}