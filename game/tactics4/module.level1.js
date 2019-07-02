import { Game } from './class.game.js';
import { Graphics } from './class.graphics.js';
import { Scenario } from './class.scenario.js';
import { Animation } from './class.animation.js';
import { View } from './module.level1.view.js';
import { Events } from './module.level1.view.js';
import { uiFixed } from './module.level1.view.js';
import { resources } from './res/res.level1.js';

var game;
var graphics;
var scenario;
var main;
var player1;
var player2;
var player3;
var view;
var events;
var spinnerClass = 'spinner';

function spinner(on) {
    on ? main.classList.add('spinner') : main.classList.remove('spinner');
};

function init(cursor) {
    main = cursor;
    game = new Game();
    graphics = new Graphics();

    game.player({title: 'player 1', kind: 'human'});
    //game.player({title: 'player 2', kind: 'human'});
    //game.player({title: 'pizda', kind: 'human'});
    game.unit({player: 0, name: 'Fighter'});
    //game.unit({player: 0, name: 'Fighter'});
    //game.unit({player: 1, name: 'Fighter'});
    //game.unit({player: 1, name: 'Fighter'});
    //game.unit({player: 2, name: 'Fighter'});
    game.addLand({land: [4, 4], options: {hex: true}});
    player1 = game.players.list[0];
    //player2 = game.players.list[1];
    //player3 = game.players.list[2];

    player1.units[0].getState()['location'] = [0, 2];
    //player1.units[1].getState()['location'] = [0, 5];
    //player2.units[0].getState()['location'] = [1, 3];
    // player2.units[1].getState()['location'] = [1, 6];
    // player3.units[0].getState()['location'] = [3, 4];

    spinner(true);

    resources().then(res => {
        graphics.setCursor(main);
        game.init();
        spinner();

        game['view'] = new View({
            game: game,
            graphics: graphics,
            resources: res,
            cursor: main
        });
        game['scenario'] = new Scenario({
            game: game,
            scenario: res.scenario,
            index: 0, //index: 1, index: 0; //startScreen
            view: game.view
        });
        game['animation'] = new Animation({
            main: main,
            game: game
        });
        game['events'] = new Events({
            main: main,
            game: game,
            view: game.view,
            scenario: game.scenario
        });
        uiFixed(game);
        //game.events.setState('distribution');
        //game.events.setState('endScreen');
        game.events.setState('startScreen');
    });

    console.log(game.land.raster())
    console.log(game)
    window['deb'] = {};
    window.deb['game'] = game;
};

    // game.effect({
    //     game: game,
    //     client: game,
    //     target: [[1, 2], [3, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
    //     task: {
    //         parent: game,
    //         title: 'slow'
    //     },
    //     setup: {}
    // });
export {
    init
}