import { eventAvailable } from './config.eventAvailable.js';

class EventMachine {
    constructor(input) {
        //current / old
        this.state = [false, false];
        //current / old
        this.cell = [false, false];
        //need to be updated
        this.defaults = input.defaults || {};
        //cursor
        this.main = input.main;
        //default event to select cells
        this.main.addEventListener('mousedown', event => {
            event.path.some(el => {
                if (el.dataset && el.dataset.sihdreCell) {
                    var yx = [el.dataset.sihdreY, el.dataset.sihdreX];
                    this.cell[1] = this.cell[0];
                    this.cell[0] = yx;
                    if (this.cell[0] && state[0]) eventAvailable[state[0]]({
                        event: event,
                        cell: this.cell
                    });
                };
            });
        });
    };
    setState(input) {
        this.state[1] = this.state[0];
        this.state[0] = this.input;
    };
};

export {
    EventMachine
}