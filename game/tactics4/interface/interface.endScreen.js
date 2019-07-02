import { animationAvailable } from '../config.animationAvailable.js';

function init(input) {
    let camera = input.view.getRender().scene.sihdre.data;
    let hudActions = input.view.getRender().hudActions.sihdre.data;
    let changed;
    let kills = input.game.points.kills;
    let lands = input.game.scenario.history.length - 2;

    input.events.setEvent({
        type: 'mousedown'
    });
    input.events.save['endScreen'] = true;
    
    input.view.add({
        type: 'hud',
        hud: {
            endGame: {
                sihdre: {
                    type: 'hud',
                    class: 'restartGame',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: -140 //btn width + padding
                },
                text: '[restart&nbsp;game]'
            }
        }
    });
    
    input.view.add({
        type: 'hud',
        hud: {
            credits: {
                sihdre: {
                    type: 'hud',
                    class: 'credits',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: camera.size.width / 2 - 260,
                    offsetY: camera.size.height / 2 - 110
                },
                text: `
                    <p>Kills: ${kills}</p>
                    <p>Points (kills / lands): ${( (kills / lands * kills) * 100 ).toString().split('.')[0]}</p>
                `
            }
        }
    });

    hudActions.axis.y.translate = camera.size.height / 2;
    hudActions.axis.x.translate = camera.size.width / 2;
    animationAvailable.endScreenCam(input);

    input.view.commit();
    return input.view.draw();
};
function hudEndGame(input) {
    return location.pathname = '/';
};
function endScreen(input) {
    //entry point
    if (!input.events.save.endScreen) return init(input);
    if (input.el.dataset.sihdreHudKey == 'endGame') return hudEndGame(input);
};

export {
    endScreen
}