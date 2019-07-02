import { effectsAvailable } from '../config.effectsAvailable.js';

class Witch {
    constructor() {
        this.defaults = {
            title: 'witch',
            status: 'alive',
            effectLocalSettings: {},
            speed: 1,
            hp: 1,
            turns: 1,
            actions: ['move', 'fireball', 'regenerate'],
            controller: 'statusControllerOrganism'
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
    fireball(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.fireball(input.target.getState());
    };
    teleport(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.teleport(input.target.getState());
    };
    regenerate(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.regenerate(input.target.getState());
    };
};

export {
    Witch
}