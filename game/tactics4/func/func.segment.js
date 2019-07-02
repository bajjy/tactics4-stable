import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

//let multiplier = 0;
//let seg = 0;
//if (segments && y%segments[0]/*4*/ == 0) multiplier = y;
//if (x%segments[1]/*4*/ == 0) seg++;
//seg: seg + multiplier + multiplier / segments[0]/*4*/

function segment(state) {
    var game = state.game;
    var around = game.land.around({yx: state.effect.target[0], radius: effectGlobalSettings.segment.exploring});
    var current;
    var explore = [];
    var opened = false;

    for (let { setup, task } of game.effects.list.get(state.effect.target[0].join(','))) {
        if (task.title == 'segment') current = setup;
    };

    around.map(point => {
        let effect = game.effects.list.get(point.join(','));
        if (effect && effect.length > 0) {
            for (let { setup, task } of effect) {
                if (task.title == 'segment' && current.id != setup.id) explore.push(setup.id)
            };
        };
    });

    for (let [key, value] of game.effects.list) {
        for (let { setup, task } of value) {
            if (task.title == 'segment' && explore.some(seg => seg == setup.id)) {
                if (setup.closed) {
                    setup.closed = false
                    opened = true;
                };
            }
        };
    };

    return opened
};

export {
    segment
}