import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function statusControllerLowOrganism(state) {
    var modificator = state.effectLocalSettings.statusControllerLowOrganism ? state.effectLocalSettings.statusControllerLowOrganism.statuses : {};
    var statuses = Object.assign({}, effectGlobalSettings.statusControllerLowOrganism.statuses, modificator);
    var status = statuses.hp[state.hp];
    var game = state.game;
    var player = game.players.list[state.player];
    var unit = player.units[state.index];
    var prevState = unit.states[unit.states.length - 2];

    state.status = status;

    if (status == 'death') {
        player.units.splice(state.index, 1);
    };

    console.log('>>>>>>>>>>>>>>>>>>>>>>');
    console.log(player);
    console.log('>>>>>>>>>>>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>>>>>>>>>>>');
};

export {
    statusControllerLowOrganism
}