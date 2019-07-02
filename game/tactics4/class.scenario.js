import * as fetchmodel from './lib.fetchmodel.js';

const formula = (top) => Math.round( (Math.random() * top) );
var game;
var view;
var builder = {
    startScreen(input) {
        
    },
    addLand(input) {
        let options = {
            land: input.land,
            options: input.options
        }

        game.addLand(options);
    },
    effect(input) {
        game.effect({
            game: game,
            client: game,
            target: input.target,
            task: {
                parent: game,
                title: input.task
            },
            setup: input.setup
        });
    },
    shuffleEffect(input) {
        let targets = input.target;
        let effects = input.setup.effects;
        targets.map(cell => {
            let rnd = formula(effects.length - 1);

            if (effects[rnd].task) {
                game.effect({
                    game: game,
                    client: game,
                    target: [cell],
                    task: {
                        parent: game,
                        title: effects[rnd].task
                    },
                    setup: effects[rnd].setup
                });
            };
            effects.splice(rnd, 1);
        })
    }
};
class Scenario {
    constructor(input) {
        game = input.game;
        view = input.view;
        this.scenario = input.scenario;
        this.index = input.index;
        this.history = [];
        this.move();
    };
    move() {
        var scene = this.scenario[this.index];
        var bg = view.getRender().scene.map.bg.sihdre.data;

        if (scene.scene) {
            bg.setAsset( fetchmodel.modelize(view.getRes(scene.scene)) );
            bg.size.width = scene.width;
            bg.size.height = scene.height;
            bg.axis.x.translate = scene.left;
            bg.axis.y.translate = scene.top;
        };
        this.build(scene.script);
        this.history.push(this.index);
        this.index = scene.index;

    };
    build(script) {
        game.effects.list = new Map();

        for (let i in script) {
            let task = JSON.parse(JSON.stringify(script[i]));
            builder[task.func](task);
        };
        
        //game.addLand({land: [4, 4], options: {hex: true}});
        view.rebuildCells();
        view.draw();
    };
}

export {
    Scenario
}