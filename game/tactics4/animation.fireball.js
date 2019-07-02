import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['fireball'];
var style = document.createElement('style');

style.id = 'animationFireball';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms linear;
    }
    .animation.fireball {
        transition: All ${settings.speed}ms linear;
    }
`;

function vector(input) {
    //astar graph is flipped 90deg, so we need to shift x and y
    var x1 = input[1]; //input
    var y1 = input[0]; //input
    var x2 = input[3];//target
    var y2 = input[2];//target
    var length = Math.sqrt( (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
    var rad = Math.atan2( (y1 - y2), (x1 - x2) );
    var angle = rad * (180 / Math.PI);
    var cycles = Math.round(length);
    var path = [];
    while (cycles > 0) {
        var L = cycles - 1; // -1 begin count next to start cell
        var x = Math.round(x2 + Math.cos(rad) * L);
        var y = Math.round(y2 + Math.sin(rad) * L);
        if (path.length > 0 && path[path.length - 1][0] == y && path[path.length - 1][1] == x) {
            //do not push duplicates (double check for bigger resolution)
            --cycles
        } else {
            path.push([y, x]);
        };
    };
    return path
};

function fireball(input, model) {
    let camera = input.view.getRender().scene.sihdre.data;
    let track = input.events.save.unit.getState().track;
    let point = model.sihdre.data;

    model.sihdre.class = 'animation fireball';
    input.view.draw();
    document.querySelector('head').appendChild(style);

    track.map((item, index) => {
        let time = settings.speed * index;
        let cell = input.view.getCell([item.x, item.y]);

        requestTimeout(() => {
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

            camera.axis.z.angle = settings.cameraZAngle - point.axis.z.angle;
            //start ignoring models update to correct smooth transitions
            input.view.draw(index > 0);
        }, time);
    });
    //remove .walking class on last frame
    requestTimeout(() => {
        delete model.sihdre.class;
        input.view.draw();
        document.querySelector('#' + style.id).remove();
    }, 10 + settings.speed * track.length);
};
export {
    fireball
}