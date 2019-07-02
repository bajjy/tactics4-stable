class State {
    constructor(input) {
        for (var prop in input) {
            this[prop] = input[prop]
        };
    };
};

export {
    State
}