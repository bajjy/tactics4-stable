import { animationGlobalSettings } from './config.animationGlobalSettings.js';
import { effectGlobalSettings } from './config.effectGlobalSettings.js';
import * as interfaceAiSelectUnitAction from './interface/interface.ai.selectUnitAction.js';
import * as interfaceMoveUnitAction from './interface/interface.moveUnitAction.js';
import * as interfaceThrustUnitAction from './interface/interface.thrustUnitAction.js';
import * as interfaceShotUnitAction from './interface/interface.shotUnitAction.js';

var stop;
var time = 0;
var anim = 0;
var animaIndex;
var first = true;
var behaviorDefaults = {
    noactions: false
};
var behavior = {};
var weights = {
    selectUnitAction: {
        action: selectUnitAction,
        weight: 0,
        options: false,
        test(input) {
            var points = 0;
            var player = input.game.TurnMachine.who();
            var units = player.units;

            if (units.length == 0) return false;
            if (!input.events.save.unit) points += 1000;
            return points
        }
    },
    lookForActions: {
        action: lookForActions,
        weight: 0,
        options: false,
        test(input) {
            var points = 0;
            var player = input.game.TurnMachine.who();
            var units = player.units;

            if (!input.events.save.actions) points += 1500;
            return points
        }
    },
    move: {
        action: move,
        weight: 0,
        options: false,
        test(input) {
            var points = 0;
            var player, unit, location, target, searches;
            var cellBeforelast;
            var cellLast;
            var blockers = false;

            if (!input.events.save.unit) return false;
            if (!input.location) return false;

            player = input.game.TurnMachine.who();
            unit = input.events.save.unit;
            location = input.location;
            
            searches = searchPathsToUnits(input, unit);

            if (searches.length == 0) return false;
            if (searches[0].length == 1) return false;
            if (!input.events.save.unit) return false;

            cellBeforelast = searches[0].length > 1 ? searches[0][searches[0].length - 2] : searches[0][0]; //cell beforelast
            cellLast = searches[0].length > 1 ? searches[0][searches[0].length - 1] : searches[0][0]; //cell beforelast

            input.game.players.list.map((currentPlayer, pIndex) => {
                currentPlayer.units.map((currentUnit, uIndex) => {
                    target = currentUnit.getState().location;
                    if (target[0] == cellBeforelast.x && target[1] == cellBeforelast.y) blockers = true
                    if (currentPlayer.kind == 'ai' && target[0] == cellLast.x && target[1] == cellLast.y) blockers = true
                });
            });

            if (blockers) return false;
            if (searches.length > 0) points += 500;
            if (searches[0].length <= unit.getState().speed + 1) points += 500; //+1 because of target unit point

            return points
        }
    },
    thrust: {
        action: thrust,
        weight: 0,
        options: false,
        test(input) {
            var points = 0;
            var settings = effectGlobalSettings['thrust'];
            var player, unit, location, target, searches;
            if (!input.events.save.unit) return false;
            if (!input.location) return false;

            player = input.game.TurnMachine.who();
            unit = input.events.save.unit;
            location = input.location;
            
            searches = searchPathsToUnits(input, unit);

            if (searches.length == 0) return false;
            if (searches[0].length <= settings.radius) points += 1000

            return points
        }
    },
    shot: {
        action: shot,
        weight: 0,
        options: false,
        test(input) {
            var points = 0;
            var settings = effectGlobalSettings['shot'];
            var player, unit, location, target, searches;
            var blockers = false;

            if (!input.events.save.unit) return false;
            if (!input.location) return false;

            player = input.game.TurnMachine.who();
            unit = input.events.save.unit;
            location = input.location;
            searches = searchShotToUnits(input, unit);
            target = unit.getState().location;

            if (searches.length == 0) return false;

            searches[0].map(cell => {
                input.game.effects.map[cell.x][cell.y].map((eff, index) => {
                    if (settings.blockers.indexOf(eff.title) > -1) blockers = true;
                });
            });

            if (blockers) return false;
            if (searches[0].length <= settings.radius) points += 1100

            return points
        }
    },
    actionPlayerFinishesTurn: {
        action: actionPlayerFinishesTurn,
        weight: 0,
        options: false,
        test(input) {
            var points = 500;
            var player = input.game.TurnMachine.who();
            var units = player.units;
            var actions = input.game.getAvailableActions();
            
            if (behavior.noactions) return points += 1500;
            if (!input.events.save.actions) return false;
            if (actions.length > 2) return false;


            points += 1000;

            return points
        }
    }
};
class Ai {
    constructor() {
        this.actions = [];
        this.thinked = [];
    }
    init(input) {
        //if (input.setup) input = input.setup.origin;
        stop = false;
        this.actions = [];
        this.thinked = [];
        behavior = Object.assign({}, behaviorDefaults);

        input.setup.origin.events.save.aiActivation = true;
        for (let key in weights) {
            var act = weights[key];
            act.weight = 0;
            if (act.test(input.setup.origin) > 0) this.thinked.push(act);
        };
        this.thinked.sort((a, b) => {
            if (a.weight < b.weight) return 1;
            if (a.weight > b.weight) return -1;
            return 0;
        });
        console.log('init')
        if (input.setup.origin.events.save.actions) return this.think(input.setup.origin);
        this.thinked[0].action(input.setup.origin, this.thinked[0].options);
        return this.think(input.setup.origin)
    };
    think(input) {
        this.thinked = [];
        if (!input.events.save.actions) {
            for (let key in weights) {
                var act = weights[key];
                var test = act.test(input);
                act.weight = 0;
                if (test > 0) this.thinked.push({
                    action: act.action,
                    weight: test,
                    options: act.options,
                    test : act.test
                });
            };
        };
        if (input.events.save.actions) {
            for (let {title} of input.events.save.actions) {
                var act = weights[title];
                if (act && act.test(input) > 0) this.thinked.push({
                    action: act.action,
                    weight: act.test(input),
                    options: act.options,
                    test : act.test
                });
            };
        };

        this.thinked.sort((a, b) => {
            if (a.weight < b.weight) return 1;
            if (a.weight > b.weight) return -1;
            return 0;
        });

        if (stop) return false;
        if (this.thinked[0] && input.events.save.finished != true) {
            console.log('AI Thinking...');
            console.log(this.thinked[0].action.name);

            return this.perform(this.thinked[0].action, input, this.thinked[0].options);
        };
        if (this.thinked.length < 1) behavior.noactions = true;
        return this.think(input);
    };
    perform(action, input, options) {
        var actionSettings = {};
        var game = input.game;
        let timeout;
        actionSettings['origin'] = input;
        actionSettings['action'] = action;
        actionSettings['time'] = {
            action: game.TurnMachine.action,
            turn: game.TurnMachine.turn,
            round: game.TurnMachine.round,
            who: game.TurnMachine.who()
        };
        this.actions.push(actionSettings);
        console.log('AI performing');

        if (first) {
            anim = input.game.changed;
            first = false;
        };
        timeout = anim > 0 ? anim : time;

        input.game.animation.removeList(input.view.getRender().scene.sihdre.animations);

        if (stop) return false;
        //exit point
        input.game.animation.actor(() => {
            if (stop) return false
            action(input, options);
            if (this.thinked[0].action.name == 'actionPlayerFinishesTurn' || input.events.save.finished) return false;
            return this.think(input);
        }, input.view.getRender().scene.sihdre, false, timeout);
    };
};

function lookForActions(input) {
    var actions = input.game.getAvailableActions();
    if (input.events.save.unit) {
        actions = input.game.getAvailableActions({
            index: input.events.save.unit.getState().index
        });
    };

    input.events.save['actions'] = actions;
    console.log('AI lookForAction');
    anim = 0;
    input.view.purge();
};
function selectUnitAction(input, index) {
    var player = input.game.TurnMachine.who();
    var unit = player.units[index || 0];
    var state = unit.getState();
    var settings = animationGlobalSettings['zoomToPoint'];

    input['location'] = state.location;
    input['el'] = { dataset: {sihdreCell: '1'} };

    interfaceAiSelectUnitAction.aiSelectUnitAction(input);
    delete input.events.save['actions'];

    console.log('AI selectUnitAction');
    //anim = input.changed.timer;
    anim = 0
    input.view.purge();
};
function move(input) {
    var player = input.game.TurnMachine.who();
    var unit = input.events.save.unit;
    var searches = searchPathsToUnits(input, unit);
    var enemyNode = searches[0][searches[0].length - 2]; //selecting before last element, because moving to squatted cell is not available
    var target = [enemyNode.x, enemyNode.y];
    var settings = animationGlobalSettings['movement'];

    input['el'] = { dataset: {sihdreHudKey: 'move'} };

    interfaceAiSelectUnitAction.aiSelectUnitAction(input);

    input['el'] = { dataset: {sihdreCell: '1'} };
    input['location'] = target;

    interfaceMoveUnitAction.moveUnitAction(input);

    input['el'] = { dataset: {sihdreHudKey: 'moveByPath'} };
    interfaceMoveUnitAction.moveUnitAction(input);

    console.log('AI move');
    console.log(input.changed.timer)
    anim = input.changed.timer;
    input.view.purge();
};
function thrust(input) {
    var unit = input.events.save.unit;
    var searches = searchPathsToUnits(input, unit);
    var enemyNode = searches[0][searches[0].length - 1]; //selecting before last element, because moving to squatted cell is not available
    var target = [enemyNode.x, enemyNode.y];
    var settings = animationGlobalSettings['thrust'];
    if (input.events.save.thrustUnitAction) input.events.save.thrustUnitAction = false;
    input['el'] = { dataset: {sihdreHudKey: 'thrust'} };

    interfaceAiSelectUnitAction.aiSelectUnitAction(input);
    input['el'] = { dataset: {sihdreCell: '1'} };
    input['location'] = target;

    interfaceThrustUnitAction.thrustUnitAction(input);

    input['el'] = { dataset: {sihdreHudKey: 'attackTarget'} };
    interfaceThrustUnitAction.thrustUnitAction(input);

    console.log('AI thrust');
    anim = input.changed.timer;
    input.view.purge();
};
function shot(input) {
    var unit = input.events.save.unit;
    var searches = searchShotToUnits(input, unit);
    var enemyNode = searches[0][searches[0].length - 1]; //selecting before last element, because moving to squatted cell is not available
    var target = [enemyNode.x, enemyNode.y];
    var settings = animationGlobalSettings['shot'];
    if (input.events.save.shotUnitAction) input.events.save.shotUnitAction = false;
    input['el'] = { dataset: {sihdreHudKey: 'shot'} };

    interfaceAiSelectUnitAction.aiSelectUnitAction(input);
    input['el'] = { dataset: {sihdreCell: '1'} };
    input['location'] = target;

    interfaceShotUnitAction.shotUnitAction(input);

    input['el'] = { dataset: {sihdreHudKey: 'attackTarget'} };
    interfaceShotUnitAction.shotUnitAction(input);

    console.log('AI shot');
    anim = input.changed.timer;
    input.view.purge();
};

function actionPlayerFinishesTurn(input) {
    first = true;
    stop = true;
    input['el'] = { dataset: {sihdreHudKey: 'aiactionPlayerFinishesTurn'} };
    input.events.save.finished = true;

    //input.game.animation.actor(() => {
        interfaceAiSelectUnitAction.aiSelectUnitAction(input);
        console.log('AI actionPlayerFinishesTurn');
    //}, input.view.getRender().scene.sihdre, false, 0);

    anim = 0;
};



function searchPathsToUnits(input, unit, target) {
    var player = input.game.TurnMachine.who();
    var searches = [];
    input.game.players.list.map((currentPlayer, pIndex) => {
        if (currentPlayer.kind == 'ai') return;
        if (player == currentPlayer) return;
        currentPlayer.units.map((currentUnit, uIndex) => {
            let mpf;
            target = currentUnit.getState().location;
            mpf = movePathfind(input, unit, target);

            searches.push(mpf);
        });
    });
    searches.sort((a, b) => {
        if (a.length < b.length) return -1;
        if (a.length > b.length) return 1;
        return 0;
    });

    return searches
};
function movePathfind(input, unit, target) {
    var unit = unit.getState();
    var yx = target;
    var search = input.game.search( {
        search: unit.location.concat(yx),
        ignore: {
            unit: true,
            effect: false
        }
    } );

    return search;
};

function searchShotToUnits(input, unit, target) {
    var player = input.game.TurnMachine.who();
    var searches = [];
    input.game.players.list.map((currentPlayer, pIndex) => {
        if (currentPlayer.kind == 'ai') return;
        if (player == currentPlayer) return;
        currentPlayer.units.map((currentUnit, uIndex) => {
            target = currentUnit.getState().location;
            searches.push(shotPathfind(input, unit, target));
        });
    });
    searches.sort((a, b) => {
        if (a.length < b.length) return -1;
        if (a.length > b.length) return 1;
        return 0;
    });

    return searches
};
function shotPathfind(input, unit, target) {
    var unit = unit.getState();
    var yx = target;
    var search = input.game.search( {
        search: unit.location.concat(yx),
        ignore: {
            unit: true,
            effect: true
        }
    } );

    return search;
};
export {
    Ai
}