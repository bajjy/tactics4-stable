import { effectGlobalSettings } from './config.effectGlobalSettings.js';

class TurnMachine {
    constructor() {
        //each action in the world
        this.action = 0;
        //query index of current player
        this.turn = 0;
        //increase the number when all players has been done
        this.round = 0;
        //players query
        this.query = [];
    };
    actor(input) {
        var index = this.query.push(input) - 1;
        return index
    };
    check(input) {
        var settings = effectGlobalSettings[input.title]
        var parent = input.parent.getState();

        if (parent.turns >= settings.cost) return true
    };
    move(input) {
        var settings = effectGlobalSettings[input.title]
        var parent = input.parent.getState();
        if (parent.turns) parent.turns -= settings.cost;
        ++this.action
    };
    who(index) {
        if (typeof index !== 'undefined') {
            return this.query[index % this.query.length];
        };
        return this.query[this.turn]
    };
    next() {
        this.who().units.map(unit => {
            unit.getState().turns = unit.defaults.turns;
        });
        if (this.turn == this.query.length - 1) {
            console.log('--------------------------')
            this.turn = 0
            ++this.round;
        } else {
            ++this.turn
        };
        return this.turn
    };
    rm(index) {
        this.query.map((el, i) => {
            if (index == el.index) this.query.splice(i, 1);
        })
    };
}

export {
    TurnMachine
}