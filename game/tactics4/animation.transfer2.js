import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['transfer'];
var style = document.createElement('style');

style.id = 'animationTransfer';
style.innerHTML = `
    [data-kkey="map"] {
        transition: All ${settings.speed}ms linear;
    }
    .animation.transfer {
        transition: All ${settings.speed}ms linear;
    }
`;

function transfer(state, phase) {
    let changed = settings.speed * (settings.steps + 1);
    let step = state['step'] + 2;
    let effect = state.effect;
    let player = state.game.TurnMachine.who().index;
    let unit = state.game.view.getCell(effect.target[0]).unit.getState();
    let model = state.game.view.getRender().scene.map[`unit_${player}_${unit.index}`];
    state['location'] = unit.location
    state['player'] = player
    state['index'] = unit.index

    state.game.animation.actor(() => {
        for (let a in state.game.animation.query) {
            let anima = state.game.animation.query[a];
            let remove = effectGlobalSettings.transfer.cancelAnimation.indexOf( anima.name ) > -1;
            let run = effectGlobalSettings.transfer.runAnimation.indexOf( anima.name ) > -1;
    
            if (run && model.sihdre == anima.state) anima.func();
            if (remove && model.sihdre == anima.state) state.game.animation.remove( anima.index );
        };
        //animationAvailable.transfer(state, 1);
        changed += transferOne(state);

        //teleportation section
        state.game.animation.actor(() => {
            let cell = state.game.view.getCell(effect.setup.pos);
            let camera = state.game.view.getRender().scene.sihdre.data;
    
            model.sihdre.data.axis.x.translate = cell.sihdre.data.axis.x.translate + settings.modelCorrectionXtranslate;
            model.sihdre.data.axis.y.translate = cell.sihdre.data.axis.y.translate + settings.modelCorrectionYtranslate;
    
            changed += transferTwo(state);
            state.game.view.draw();
        }, model.sihdre, 'transfer', settings.speed * (settings.steps + 1)); //+1 because track array in animation.transfer is always bigger by 1
    
    }, model.sihdre, 'transfer', 0);
    return {
        timer: changed
    }
};
function transferTwo(state) {
    let effect = state.effect;
    let camera = state.game.view.getRender().scene.sihdre.data;
    let cell = state.game.view.getCell([ state.location[0], state.location[1] ]);
    let model = state.game.view.getRender().scene.map[`unit_${state.player}_${state.index}`];
    let point = model.sihdre.data;
    model.sihdre.class = 'animation transfer';

    state.game.view.draw();
    document.querySelector('head').appendChild(style);
    camera.connection();
    state.game.animation.actor(() => {
        point.axis.x.translate = cell.sihdre.data.axis.x.translate;
        point.axis.y.translate = cell.sihdre.data.axis.y.translate;

        camera.connect(point);
        camera.connection();
        state.game.view.draw(true);
    }, model.sihdre, 'transfer', 1);

    state.game.animation.actor(() => {
        delete model.sihdre.class;
        state.game.view.draw();
        document.querySelector('#' + style.id).remove();
    }, model.sihdre, 'transferStyles', settings.speed);
    return settings.speed
};
function transferOne(state) {
    let effect = state.effect;
    let camera = state.game.view.getRender().scene.sihdre.data;
    let cell = state.game.view.getCell([ state.location[0], state.location[1] ]);
    let model = state.game.view.getRender().scene.map[`unit_${state.player}_${state.index}`];
    let point = model.sihdre.data;
    let track = [[cell.sihdre.data.axis.y.translate, cell.sihdre.data.axis.x.translate]];
    let incr = graphicsGlobalSettings.cellSize;
    let steps = settings.steps;
    let axis = settings.axis;
    let camZ;

    model.sihdre.class = 'animation transfer';
    state.game.view.draw();
    document.querySelector('head').appendChild(style);

    // camera.connect(point);
    // camera.connection();
    // camZ = camera.axis.z.translate += settings.camTranslateZstep;
    // camera.axis.z.translate = camZ;
    // camera.axis.y.translate += settings.camTranslateYstep;
    // camera.axis.x.translate -= settings.camTranslateXstep;
    // state.game.view.draw(true);

    for (let i = 1; i <= steps; ++i) {
        let x = track[i - 1][1] + (incr * (i%2));
        let y = track[i - 1][0] + (incr * (i%2));
        if (i == steps) {
            x = track[i - 1][1] - incr;
            y = track[i - 1][0] + incr / 2;
        };
        track.push([y,x]);
    };

    track.map((item, index) => {
        let time = settings.speed * index;
        state.game.animation.actor(() => {
            let x1 = point.axis.x.translate;
            let x2 = item[1];
            let y1 = point.axis.y.translate;
            let y2 = item[0];
            let angle = Math.atan2( (y1 - y2), (x1 - x2) ) * (180 / Math.PI);

            point.axis.x.translate = item[1];
            point.axis.y.translate = item[0];

            //camera.connect(point);
            //camera.connection();

            if (index > 0) point.axis.z.angle -= point.axis.z.angle - angle;

            for (let key in axis) {
                let value = axis[key]
                for (let kkey in value) {
                    camera.axis[key][kkey] = value[kkey];
                };
            };

            //following camera
            // camera.axis.z.angle -= point.axis.z.angle;
            // camera.axis.z.translate = camZ;
            // camera.axis.y.translate += settings.camTranslateYstep;
            camera.axis.x.translate -= settings.camTranslateXstep;
            // //when last step - camera back;
            // if (steps == index) {
            //         camera.axis.z.translate -= settings.camTranslateZstep;
            //         camera.axis.y.translate -= settings.camTranslateYstep;
            //         camera.axis.x.translate += settings.camTranslateXstep;
            //         camera.axis.z.angle = settings.camAngleZrestore;
            //         camera.axis.x.angle = settings.camAngleXrestore;
            // };
            //start ignoring models update to correct smooth transitions
            state.game.view.draw(true);
        }, model.sihdre, 'transfer', time);
    });
    state.game.animation.actor(() => {
        delete model.sihdre.class;
        state.game.view.draw();
        document.querySelector('#' + style.id).remove();
    }, model.sihdre, 'transferStyles', settings.speed * track.length);

    //state.game.view.draw();
    return settings.speed * track.length
};
export {
    transfer
}