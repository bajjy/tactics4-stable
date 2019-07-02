// import { effectGlobalSettings } from './config.effectGlobalSettings.js';
// import { animationAvailable } from './config.animationAvailable.js';
// import { animationGlobalSettings } from './config.animationGlobalSettings.js';

// var settings = animationGlobalSettings['transfer'];

// /**
//  * Switch scenario pages and move unit to point
//  * requires {@link class.view}
//  * requires {@link class.scenario}
//  */

// function transfer(state) {
//     let step = state['step'] + 2;
//     let effect = state.effect;
//     let scenario = state.game.scenario;
//     let model = state.game.view.getRender().scene.map[`unit_${0}_${0}`];

//             //remove all players exept caller
//             state.game.players.list.map(el => {
//                 if (el.index != state.game.TurnMachine.who().index) state.game.playerRemove(el.index);
//             });

//     state.game.animation.actor(() => {
//         for (let a in state.game.animation.query) {
//             let anima = state.game.animation.query[a];
//             let remove = effectGlobalSettings.transfer.cancelAnimation.indexOf( anima.name ) > -1;
//             let run = effectGlobalSettings.transfer.runAnimation.indexOf( anima.name ) > -1;

//             if (run && model.sihdre == anima.state) anima.func();
//             if (remove && model.sihdre == anima.state) state.game.animation.remove( anima.index );
//         };
//         animationAvailable.transfer(state, 1);

//         //teleportation section
//         state.game.animation.actor(() => {
//             let cell = state.game.view.getCell(effect.setup.pos);
//             let camera = state.game.view.getRender().scene.sihdre.data;

//             scenario.index = effect.setup.page;
//             scenario.move();
//             state.location = effect.setup.pos;
//             model.sihdre.data.axis.x.translate = cell.sihdre.data.axis.x.translate + settings.modelCorrectionXtranslate;
//             model.sihdre.data.axis.y.translate = cell.sihdre.data.axis.y.translate + settings.modelCorrectionYtranslate;
//             //animationAvailable.transfer(state, 2);
//             //camera.connection();

//             animationAvailable.transfer(state, 2);
//             state.game.view.draw();
//         }, model.sihdre, 'transfer', settings.speed * (settings.steps + 1)); //+1 because track array in animation.transfer is always bigger by 1

//     }, model.sihdre, 'transfer', settings.speed * step);

//     return true
// };

// export {
//     transfer
// }

import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { animationAvailable } from '../config.animationAvailable.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

var settings = animationGlobalSettings['transfer'];

/**
 * Switch scenario pages and move unit to point
 * requires {@link class.view}
 * requires {@link class.scenario}
 */

function transfer(state) {
    let effect = state.effect;
    let scenario = state.game.scenario;
    let player = state.game.TurnMachine.who().index;
    let unit = state.game.view.getCell(effect.target[0]).unit.getState().index;
    let model = state.game.view.getRender().scene.map[`unit_${player}_${unit}`];
    let cell = state.game.view.getCell(effect.setup.pos);

    if (state.game.TurnMachine.who().kind == 'ai') return false
    //remove all players exept caller
    state.game.players.list.map(el => {
        if (el.index != player) state.game.playerRemove(el.index);
    });

    state.game.players.list[0].units[0].getState().location = effect.setup.pos;
    model.sihdre.data.axis.x.translate = cell.sihdre.data.axis.x.translate;
    model.sihdre.data.axis.y.translate = cell.sihdre.data.axis.y.translate;

    scenario.index = effect.setup.page;
    scenario.move();

    state.game['changed'] = animationAvailable.transfer(state).timer;
    return true
};

export {
    transfer
}