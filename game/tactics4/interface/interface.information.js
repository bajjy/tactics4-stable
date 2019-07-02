import { informationEffects } from './interface.informationEffects.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function info(view, text) {
    view.add({
        type: 'hudActions',
        hudActions: {
            line: {
                sihdre: {
                    type: 'hud',
                    class: 'menu selectUnitAction info',
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
function adv(view, text, location) {

    view.add({
        type: 'hud',
        hud: {
            advice: {
                sihdre: {
                    type: 'hud',
                    class: 'advice',
                    target: `[data-sihdre-cell="1"][data-yx="${location[0]},${location[1]}"]`,
                },
                text: '',
                tip: {
                    sihdre: {
                        type: 'hud'
                    },
                    text: text
                }
            }
        }
    });

    view.commit();
    view.draw();
};

function information(input, text) {
    var next = input.game.TurnMachine.who(input.game.TurnMachine.turn + 1);
    var curr = {
        title: input.game.TurnMachine.who().title,
        kind: input.game.TurnMachine.who().kind,
        units: input.game.TurnMachine.who().units.length,
        next: {
            title: next.title,
            kind: next.kind,
            units: next.units.length
        }
    };
    var defaultText = `
        <strong>${curr.title}</strong>
        <div>${curr.kind} with ${curr.units}</div>
        <small>next: ${curr.next.kind}, ${curr.next.title}</small>
    `;

    if (text) return info(input.view, text)
    info(input.view, defaultText)

    //setting up effects info
    //informationEffects(input);
    return curr
};
function effectInfo(input, effect) {
    info(input.view, `
        ${effectGlobalSettings[effect].text()}
    `)
};
function advice(input) {
    var effectsMap = input.game.effects.map;
    var yx = input.location || input.el.dataset.yx.split(',');
    var text = '';

    effectsMap[yx[0]][yx[1]].map(effect => {
        text += `${effectGlobalSettings[effect.title].text()}`;
    });
    if (text.length < 1) return false;
    adv(input.view, text, yx);
};

export {
    information,
    effectInfo,
    advice
}