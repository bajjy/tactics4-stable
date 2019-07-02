/**
 * Generates new unit, unit make his turn immediately
 * requires {@link class.view}
 */

function aiActivation(state) {
    var player = state.game.TurnMachine.who();
    player.ai.init(state);
    return true
};

export {
    aiActivation
}