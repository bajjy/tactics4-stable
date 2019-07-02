import * as perform from './lib.performance.js';
var start = performance.now();

function s4() {
    var r = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return r() + r();
};
function test(delta, anima) {
    //if (window.settings.navigator == 'safari') return delta >= anima.timeout;
    //if (window.innerWidth >= 1200) return delta >= anima.start + anima.timeout;
    return delta >= anima.timeout;
};

class Animation {
    constructor() {
        start = performance.now();
        this.action = 0;
        this.query = {};
        this.delta = 0;
        this.cycle;
        this.run();

    };
    run() {
        window.requestAnimFrameClear = false;
        if (this.cycle) clearRequestInterval(this.cycle);
        this.cycle = requestInterval(() => {

            for (let key in this.query) {
                let anima = this.query[key];
                if (anima.stop) return false;
                if (test(this.delta, anima)) {
                    anima.start = this.delta;
                    anima.func();
                    if (anima.repeat == 'infinite') return
                    --anima.repeat;
                    if (anima.repeat == -1) {
                        this.remove(key);
                    };
                };
            };

            this.delta = performance.now() - start;
        }, perform.fps('fps60'));
    };
    actor(func, state, name, timeout = 0, repeat = 0) {
        let anima;
        let index = s4();

        if (!state['animations']) state['animations'] = [];

        this.query[index] = {};
        anima = this.query[index];

        anima['index'] = index;
        anima['name'] = name;
        anima['func'] = func;
        anima['timeout'] = timeout;
        anima['repeat'] = repeat;
        anima['start'] = performance.now();
        anima['state'] = state;

        state['animations'].push(index);
        return index
    };
    remove(index) {
        let anima = this.query[index];
        if (anima) anima.state.animations.splice(anima.state.animations.indexOf(anima.index), 1);
        delete this.query[index]
    };
    removeList(list) {
        if (!list) return false
        list.map(el => {
            let anima = this.query[el];
            if (anima) this.remove(el);
        });
    };
    clear() {
        clearRequestInterval(this.cycle);
        for (let key in this.query) {
            let anima = this.query[key];
            anima['stop'] = true;
            this.remove(key);
        };
    };
    stop() {
        window.requestAnimFrameClear = true;
    }
};

export {
    Animation
}