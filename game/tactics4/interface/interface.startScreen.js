import { animationAvailable } from '../config.animationAvailable.js';

function init(input) {
    let camera = input.view.getRender().scene.sihdre.data;
    let hudActions = input.view.getRender().hudActions.sihdre.data;
    let changed;
    input.events.setEvent({
        type: 'mousedown'
    });
    input.events.save['startScreen'] = true;
    
    input.view.add({
        type: 'hud',
        hud: {
            startGame: {
                sihdre: {
                    type: 'hud',
                    class: 'startGame',
                    render: '',
                    target: '[data-kkey="hudActions"]',
                    offsetX: -120 //btn width + padding
                },
                text: '[start game]'
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
                    <small>Its a prototype writed with js, css, html.</small>
                    <small>No canvas, math, engines. simple as this.</small>
                    <a href="https://www.facebook.com/artem.natan" rel="nofollow">Artem Natalchishin</a>, 
                    <a href="https://www.facebook.com/nejsut" rel="nofollow">Denis Zdanovskiy</a>, 
                    <a href="https://www.facebook.com/bajjyxilo" rel="nofollow">Constantine Dobrovolskiy</a>

                `
            }
        }
    });

    hudActions.axis.y.translate = camera.size.height / 2;
    hudActions.axis.x.translate = camera.size.width / 2;
    animationAvailable.startScreenCam(input);

    input.view.commit();
    return input.view.draw();
};
function hudStartGame(input) {
    let changed;
    document.querySelector('#bganimationStartScreenCam').remove();
    input.view.purge();
    changed = animationAvailable.endStartScreen(input);
    input['changed'] = changed || 0;
    input.game.animation.actor(() => {
        input.game.scenario.index = 1;
        input.game.scenario.move();
        input.events.setState('distribution');
    }, {}, false, changed.timer);

    return changed
};
function startScreen(input) {
    //entry point
    if (!input.events.save.startScreen) return init(input);
    if (input.el.dataset.sihdreHudKey == 'startGame') return hudStartGame(input);
};

export {
    startScreen
}