import { effectsAvailable } from '../config.effectsAvailable.js';

class Shooter {
    constructor() {
        this.defaults = {
            title: 'shooter',
            status: 'alive',
            effectLocalSettings: {},
            speed: 1,
            hp: 0,
            turns: 1,
            actions: ['move', 'shot'],
            controller: 'statusControllerLowOrganism'
        };
        this.states = [];
    };
    getState() {
        return this.states[this.states.length - 1]
    };
    move(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['path'] = input.setup.path;
        effectsAvailable.move(state);
    };
    shot(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.shot(input.target.getState());
    };
};

export {
    Shooter
}