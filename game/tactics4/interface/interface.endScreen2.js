import * as level1 from '../module.level1.js'

function init(input) {
    console.log('YOU DIED');
    hudNewGame(input);
    //workaround to kill phantom js processes and timers
    //throw "restart";
};
function hudNewGame(input) {
    var main = document.createElement('main');

    destroyGame(input);
    document.querySelector('body').appendChild(main);
    level1.init(main);
    // requestInterval(() => {
    //     document.querySelector('body').appendChild(main);
    //     level1.init(main);
    // }, 1000)
};
function destroyGame(input) {
    //stoping animations
    input.game.animation.clear();
    input.game.animation.stop();
    //unset mousedown because in level 1 distribution we set it;
    input.game.events.unset({type: 'mousedown'});
    //destroing MAIN cursor
    input.game.view.getCursor().remove();
    //players
    input.game.TurnMachine.query.map((pl, i) => {
        if (pl.ai) delete pl.ai;
        input.game.TurnMachine.rm(i)
    })
    //set null all game objects
    input.game.destroy();
    //removing game object
    delete input.game
};
function endScreen(input) {
    //entry point
    if (!input.events.save.startScreen) return init(input);
    if (input.el.dataset.sihdreHudKey == 'newGame') return hudNewGame(input);
};

export {
    endScreen
}