import { State } from './class.state.js';

class StateMachine {
    constructor() {
        this.list = []
    };
    state(input) {
        console.log(input)
        var newState = new State(input.target.getState());
        
        this.list.push(input.client, input.target);
        input.target.states.push(newState);
        return newState
    };
};

export {
    StateMachine
}