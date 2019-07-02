import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function hud(data) {
    var input = data.input;
    var title = data.title;
    var name = data.name;
    var text = data.text;
    var location = data.location;

    input.view.add({
        type: 'hud',
        hud: {
            [name]: {
                sihdre: {
                    type: 'tip',
                    class: `tip tip-${title}`,
                    render: '',
                    target: `[data-sihdre-cell="1"][data-yx="${location[0]},${location[1]}"]`,
                },
                text: '',
                info: {
                    sihdre: {
                        type: 'hud'
                    },
                    text: text
                }
            }
        }
    });
};

function informationEffects(input) {
    var game = input.game;

    for (var [key, value] of game.effects.list) {
        value.map((effect, i) => {
            var settings = effectGlobalSettings[effect.title];
            var location = key.split(',').map(n => parseInt(n));
            var title = effect.title;
            var name = `${key}_${i}_${effect.title}`;
            var text = settings.text();
            hud({input, title, name, text, location});
        })
    };

    game.players.list.map((currentPlayer, i) => {
        currentPlayer.units.map((currentUnit, u) => {
            var unit = currentUnit.getState();
            var location = unit.location;
            var title = unit.title;
            var name = `${i}_${u}_${unit.title}`;
            var yours = `owner: ${currentPlayer.title}, ${currentPlayer.kind}`;
            var text = '';

            if (input.game.TurnMachine.who().index == currentPlayer.index) yours = '<span class="red">yours</span>';
            text = `
                <strong>${title}</strong>
                <div>${yours}</div>
            `;

            hud({input, title, name, text, location});
        });
    });

};

export {
    informationEffects
}