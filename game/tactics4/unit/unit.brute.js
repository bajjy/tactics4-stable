import { effectsAvailable } from '../config.effectsAvailable.js';

class Brute {
    constructor() {
        this.defaults = {
            title: 'brute',
            status: 'alive',
            effectLocalSettings: {},
            speed: 2,
            hp: 0,
            turns: 1,
            actions: ['move', 'thrust'],
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
    thrust(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.thrust(input.target.getState());
    };
};

export {
    Brute
}