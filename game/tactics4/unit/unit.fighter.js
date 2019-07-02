import { effectsAvailable } from '../config.effectsAvailable.js';

class Fighter {
    constructor() {
        this.defaults = {
            title: 'fighter',
            status: 'alive',
            effectLocalSettings: {},
            speed: 2,
            hp: 1,
            turns: 1,
            actions: ['move', 'thrust'],
            // items: [
            //     {
            //         title: 'regenerate',
            //         qty: 1,
            //         action(input) {
            //             var state = this.getState();
            //             state.client = input.client;
            //             state['effectsMap'] = input.setup.effectsMap;
            //             state['target'] = input.setup.target;
            //             effectsAvailable.regenerate(input.target.getState());
            //         }
            //     }
            // ],
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
    thrust(input) {
        var state = this.getState();
        state.client = input.client;
        state['effectsMap'] = input.setup.effectsMap;
        state['target'] = input.setup.target;
        effectsAvailable.thrust(input.target.getState());
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
    Fighter
}