import { effectGlobalSettings } from './config.effectGlobalSettings.js';

var endings = {
    rounds(input) {
        return input.settings.ending[1].amount > (input.effect.time.round - input.turnMachine.round)
    },
    neighbour(input) {
        var game = input.effect.game;
        var settings = input.settings;
        var destroy = false;
        for (let { setup, task } of game.effects.list.get(input.effect.target[0].join(','))) {

            for (let [key, value] of Object.entries(settings.ending[1])) {
                for (let [akey, avalue] of Object.entries(value)) {
                    if (task.title == key && setup[akey] == avalue) destroy = true;
                }
            }
        };
        return destroy
    },
    endless(input) {
        
    }
};

class Effects {
    constructor(map) {
        this.map = map;
        this.list = new Map();
    };
    raster() {
        var rast = '';
        this.map.map(y => {
            y.map(x => {
                rast += x.length > 0 ? ' ' + x.length + ' ' : ' []';
            });
            rast += '\n'
        })
        return rast
    };
    effect(input) {
        var effectSettings = input;

        effectSettings.target.map(cell => {
            var y = cell[0];
            var x = cell[1];
            var index = this.map[y][x].push(effectSettings) - 1;

            if (this.list.has(y + ',' + x)) {
                this.list.get(y + ',' + x).push(effectSettings)
                return
            };
            this.list.set(y + ',' + x, [effectSettings]);
        });

        //push new effect
        //set lifetime according to turnmachine
    };
    move(input) {
        var turnMachine = input;

        for (var [key, value] of this.list) {
            value.map((effect, i) => {
                var settings = effectGlobalSettings[effect.title];
                var setup = {settings, effect, turnMachine};
                if ( endings[settings.ending[0]](setup) ) {
                    var yx = key.split(',');
                    var cell = this.map[ yx[0] ][ yx[1] ];
                    var index = cell.indexOf(effect);

                    cell.splice(index, 1);
                    value.splice(i, 1);
                };
            })
        };
        console.log(this.list)
    };
};

export {
    Effects
}