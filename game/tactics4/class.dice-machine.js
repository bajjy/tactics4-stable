//const formula = () => Math.round(((Math.random()*6) / 6) * 100);
const maximum = 5;
const formula = (top) => Math.round((Math.random() * top) + 1);

class DiceMachine {
    constructor() {
        this.list = [];
    };
    dice(input) {
        let current = input.dice || maximum;
        let newDice = {
            state: input,
            amount: formula(current)
        }
        this.list.push(newDice);
        return newDice
    };
    chance(d, max) {
        let current = max || maximum;
        let dice = formula(current);
        return {
            dice: dice,
            maximum: maximum,
            chance: ((d) / (current + 1)) * 100
        }
    }
};

export {
    DiceMachine
}