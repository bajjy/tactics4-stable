import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['movement'];
var style = document.createElement('style');

style.id = 'animationMovement';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms linear;
    }
    .animation.movement {
        transition: All ${settings.speed}ms linear;
    }
`;

function movement(input, model) {
    let camera = input.view.getRender().scene.sihdre.data;
    let track = input.events.save.unit.getState().track;
    let point = model.sihdre.data;
    let axis = settings.axis;

    model.sihdre.class = 'animation movement';
    input.view.draw();
    document.querySelector('head').appendChild(style);

    track.map((item, index) => {
        let time = settings.speed * index;
        let cell = input.view.getCell([item.x, item.y]);
        console.log(time)
        input.game.animation.actor(() => {
            let x1 = point.axis.x.translate;
            let x2 = cell.sihdre.data.axis.x.translate;
            let y1 = point.axis.y.translate;
            let y2 = cell.sihdre.data.axis.y.translate;
            let angle = Math.atan2( (y1 - y2), (x1 - x2) ) * (180 / Math.PI);

            if (index > 0) point.axis.z.angle -= point.axis.z.angle - angle;

            point.axis.x.translate = cell.sihdre.data.axis.x.translate;
            point.axis.y.translate = cell.sihdre.data.axis.y.translate;

            camera.connect(point);
            camera.connection();

            for (let key in axis) {
                let value = axis[key]
                for (let kkey in value) {
                    camera.axis[key][kkey] = value[kkey];
                };
            };
            if (item.y < 1) camera.axis.y.translate += settings.CamTranslateYCorr;
            if (item.y < 1) camera.axis.z.translate = settings.CamTranslateXCorr;
            //start ignoring models update to correct smooth transitions
            input.view.draw(index > 0);
        }, model.sihdre, 'movement', time);
    });

    //remove .walking class on last frame
    input.game.animation.actor(() => {
        delete model.sihdre.class;
        input.view.draw();
        document.querySelector('#' + style.id).remove();
    }, model.sihdre, 'movementStyles', settings.speed * track.length);
    return {
        timer: settings.speed * track.length
    }
};
export {
    movement
}