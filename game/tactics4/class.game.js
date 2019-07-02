import { StateMachine } from './class.state-machine.js';
import { TurnMachine } from './class.turn-machine.js';
import { DiceMachine } from './class.dice-machine.js';
import { Players } from './class.players.js';
import { Land } from './class.land.js';
import { Effects } from './class.effects.js';
import { unitsAvailable } from './config.unitsAvailable.js';
import { effectsAvailable } from './config.effectsAvailable.js';
import { effectGlobalSettings } from './config.effectGlobalSettings.js';

class Game {
    constructor() {
        this.title = 'game';
        this.players = new Players();
        this.land;
        this.effects;
        this.dices;
        this.savings = [];
        this.performance = {
            fps: 60,
            delta: 0
        };
        this.points = {
            kills: 0,
            lands: 0
        };
        this.StateMachine = new StateMachine();
        this.TurnMachine = new TurnMachine();
        this.DiceMachine = new DiceMachine();
    };
    addLand(input) {
        var land = input.land;
        var options = input.options;
        var map = Array.from(new Array(land[0]), () => {
            return Array.from(new Array(land[1]), () => 1);
        });
        var effectsMap = Array.from(new Array(land[0]), () => {
            return Array.from(new Array(land[1]), () => []);
        });

        this.land = new Land(map, options);
        this.effects = new Effects(effectsMap);
    };
    action(input) {
        var actionSettings = input;
        var round = this.TurnMachine.round;
        console.log(actionSettings)
        actionSettings['parent'] = actionSettings.task.parent;
        actionSettings['title'] = actionSettings.task.title;
        actionSettings['action'] = actionSettings.task[actionSettings.title];

        //delete actionSettings.task;
        this.StateMachine.state(actionSettings);
        this.TurnMachine.move(actionSettings);
        input.action.call(actionSettings.parent, actionSettings);

        //status control
        //if (actionSettings.target.getState().hp <= 0) actionSettings.target.getState().status = 0;
        this.statusesCheck();
        //event control
        // if (this.TurnMachine.round > round) {
        //     var state = {
        //         effectLocalSettings: {
        //             epicMessage: {
        //                 text: `. ${game.TurnMachine.round} cycle of endless battle`
        //             }
        //         }
        //     }
        //     effectsAvailable.epicMessage(state);
        // };
        this.effects.move(this.TurnMachine);
    };
    effect(input) {
        var effectSettings = input;
        var round = this.TurnMachine.round;

        effectSettings['parent'] = effectSettings.task.parent;
        effectSettings['title'] = effectSettings.task.title;
        effectSettings['action'] = effectsAvailable[effectSettings.title];
        effectSettings['affected'] = [];
        effectSettings['time'] = {
            action: this.TurnMachine.action,
            turn: this.TurnMachine.turn,
            round: this.TurnMachine.round,
            who: this.TurnMachine.who()
        };

        this.effects.effect(effectSettings);
    };
    unit(input) {
        var player = this.players.list[input.player];
        var index = player.units.push(new unitsAvailable[input.name]) - 1;
        var unit = player.units[index];
        var settings = unit.defaults;
        settings.client = this;
        settings['index'] = index;
        settings['player'] = input.player;
        settings['game'] = this;
        unit.states.push( Object.assign({}, settings) );
        return index
    };
    player(input) {
        var index;
        var newPlayer;

        if (input.kind == 'ai') index = this.players.newAI(input);
        if (input.kind == 'human') index = this.players.newPlayer(input);
        newPlayer = this.players.list[index];
        newPlayer['index'] = index;

        newPlayer['actions'] = [];
        newPlayer['actionPlayerFinishesTurn'] = effectsAvailable.actionPlayerFinishesTurn;
        newPlayer.actions.push('actionPlayerFinishesTurn');
        if (input.kind == 'ai') {
            newPlayer['aiActivation'] = effectsAvailable.aiActivation;
            newPlayer.actions.push('aiActivation');
        };
        this.TurnMachine.actor(this.players.list[index]);
        return index
    };
    playerRemove(index) {
        this.players.rm(index);
        this.TurnMachine.rm(index);
    }
    init() {
        console.log('new game')
    };

    /**
     * Checking availibility of action.
     * @param {Object} input - Action and action owner who need to be checked.
     * @param {Object} input.parent - Unit instance.
     * @param {string} input.title - Action title.
     */
    checkActionAvailable(input) {
        var settings = effectGlobalSettings[input.title]
        var parent = input.parent.getState();
        
        if (!settings.disabled) return true;
        console.log(input.title, settings.disabled.some(dis => dis == parent.status))
        if (settings.disabled.some(dis => dis == parent.status)) return false;
    };
    getAvailableActions(input) {
        var currentPlayer = this.TurnMachine.who();
        var actionsAvailable = [];
        if (!input) {
            currentPlayer.units.map(iUnit => {
                iUnit.getState().actions.map(action => {
                    var check = {
                        parent: iUnit,
                        title: action
                    };

                    if (!this.TurnMachine.check(check)) return false
                    if (this.checkActionAvailable(check) == false) return false

                    check[action] = iUnit[action];
                    actionsAvailable.push(check);
                });
            });
        };
        if (input) {
            currentPlayer.units[input.index].getState().actions.map(action => {
                var check = {
                    parent: currentPlayer.units[input.index],
                    title: action
                };

                if (!this.TurnMachine.check(check)) return false;
                if (this.checkActionAvailable(check) == false) return false

                check[action] = currentPlayer.units[input.index][action];
                actionsAvailable.push(check);
            });
        };
        currentPlayer.actions.map(action => {
            var check = {
                parent: currentPlayer,
                title: action
            };
            check[action] = currentPlayer[action];
            actionsAvailable.push(check);
        });
        return actionsAvailable
    };

    statusesCheck() {
        this.players.list.map(currentPlayer => {
            currentPlayer.units.map(currentUnit => {
                var currUnitState = currentUnit.getState();
                var controller = currUnitState.controller;
                effectsAvailable[controller](currUnitState);
                this.pointsCount(currUnitState);
            });
        });
    };
    search(input) {
        var weights = [];
        if (input.ignore && input.ignore.effect == false || !input.ignore) {
            for (var [key, value] of this.effects.list) {
                value.map((effect, i) => {
                    var settings = effectGlobalSettings[effect.title];
                    var location = key.split(',').map(n => parseInt(n));
                    if ( typeof(settings.weight) !== 'undefined' ) {
                        weights.push({yx: location, weight: settings.weight});
                    };
                })
            };
        };
        if (input.ignore && input.ignore.unit == false || !input.ignore) {
            this.players.list.map(currentPlayer => {
                currentPlayer.units.map(currentUnit => {
                    var location = currentUnit.getState().location;
                    weights.push({yx: location, weight: 0});
                });
            });
        };
        return this.land.search(input.search, weights)
    }
    findEffect(input) {
        var found = [];
        for (var [key, value] of this.effects.list) {
            value.map((effect, i) => {
                if (effect.title != input.title) return false
                found.push([key.split(','), effect])
            })
        };
        return found
    };
    dice(state) {
        var dice = this.DiceMachine.dice(state)
        return dice
    };
    diceChance(input) {
        return this.DiceMachine.chance(input);
    };
    save(input) {
        this.savings.push(input)
    };
    destroy() {
        for (let i in this) {
            delete this[i]
        }
    };

    pointsCount(state) {
        if (state.client.kind == 'ai' && state.status == 'death') this.points.kills += 1;
    };
};

export {
    Game
}
/*
* ОТВЕТКА!!!
* В точку где останавливается ближний бой
* и вокруг нее (в рамкас дальности) устанавливаются
* эффекты повреждения тригерящиеся на движение
* во време перемещения ближника - эффекты переписываются
*/

/*
* GAME SCHEME
* 
*/