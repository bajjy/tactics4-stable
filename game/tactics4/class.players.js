import { Ai } from './class.ai.js';
class Players {
    constructor(input) {
        this.list = [];
    };
    newPlayer(input) {
        var defaults = {
            kind: 'human',
            units: [],
            states: [],
            getState() {
                return this.states[this.states.length - 1]
            }
        };
        defaults['title'] = input['title'];
        defaults.states.push(defaults);
        return this.list.push(defaults) - 1;
    };
    newAI(input) {
        var defaults = {
            kind: 'ai',
            ai: new Ai(),
            units: [],
            states: [],
            getState() {
                return this.states[this.states.length - 1]
            }
        };
        defaults['title'] = input['title'];
        defaults.states.push(defaults);
        return this.list.push(defaults) - 1;
    };
    rm(index) {
        this.list.map((el, i) => {
            if (index == el.index) this.list.splice(i, 1);
        })
    };
};

export {
    Players
}