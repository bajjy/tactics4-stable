import { endScreen } from "./interface.endScreen.js";

var endingScenePage = 4;

function init(input) {
    var player = input.game.TurnMachine.who();
    var aiUnitsCount = 0;

    input.game.players.list.map(currentPlayer => {
        if (currentPlayer.kind != 'ai') return false
        aiUnitsCount += currentPlayer.units.length;
    });

    if (player.kind != 'human') return false;
    if (input.game.TurnMachine.round > 0 && aiUnitsCount == 0) showNextLand(input);
    if (player.units.length > 0) return false;

    showEndScreen(input);
    return true
};

function showNextLand(input) {
    input.events.save['level1GlobalState'] = true;
    input.view.add({
        type: 'hud',
        hud: {
            transferUnit: {
                sihdre: {
                    type: 'hud',
                    class: 'menu transfer circle',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: 1
                },
                text: '',
                info: {
                    sihdre: {
                        type: 'hud'
                    },
                    text: 'Go to next land'
                }
            }
        }
    });

};

function showEndScreen(input) {
    input.game.scenario.index = endingScenePage;
    input.game.scenario.move();
    input.events.setState('endScreen');
    return true
};

function level1GlobalState(input) {
    if (!input.events.save.level1GlobalState) return init(input);
};

export {
    level1GlobalState
}