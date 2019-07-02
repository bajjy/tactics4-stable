import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function move(state) {
    var effectsMap = state.effectsMap;

    state['track'] = state.path;
    state['step'] = 0;
    state.path.map(cell => {
        var y = cell.x;
        var x = cell.y;

        effectsMap[y][x].map(effect => {
            if (effectGlobalSettings.move.reacts.indexOf(effect.title) == -1) return false;
            state['effect'] = effect;
            if (effect.action(state)) {
                effect.affected.push(state)
            };
        });
        ++state.step;
    });
    state.track.unshift(state.game.land.graph.grid[ state.location[0] ][ state.location[1] ]);
    state.step = 0;
    state.path.map(step => {
        state['location'] = [step.x, step.y]; //inverted yx because of pathfind lib!
    });

    return true
};

export {
    move
}