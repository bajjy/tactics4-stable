import { effectGlobalSettings } from '../config.effectGlobalSettings.js';
import { animationAvailable } from '../config.animationAvailable.js';
import { animationGlobalSettings } from '../config.animationGlobalSettings.js';

const formula = (top) => Math.round( (Math.random() * top) );
var settings = animationGlobalSettings['dwelling'];

function s4() {
    var r = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return r() + r();
};

/**
 * Generates new unit, unit make his turn immediately
 * requires {@link class.view}
 */

function dwelling(state) {
    if (state.effect.setup.active) return false;
    let game = state.game;
    let effect = state.effect;
    let creatures = effect.setup.creatures; 
    let index = game.player({title: `${s4()}`, kind: 'ai'});
    let player = game.players.list[index];
    let rnd = formula(creatures.length - 1);

    game.unit({player: index, name: creatures[rnd]});
    player.units[0].getState()['location'] = state.effect.target[0];

    game.view.addUnit(player.units[0], index, 0);
    state.effect.setup['active'] = true;

    return true
};

export {
    dwelling
}