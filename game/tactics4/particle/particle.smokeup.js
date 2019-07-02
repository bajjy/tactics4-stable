import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';

var style = document.createElement('style');
style.id = 'particleDeath';
var t = 5000;
var w = 150;
var h = 150;
var frames = 33;
var wide = frames * w;
var url;
var transform = ``;

function appendStyle() {
    style.innerHTML += `
        .particle-death {
            position: absolute;
            width: ${w}px;
            height: ${h}px;
            background-position: 0px 0;
            background-size: cover;
            transform-style: preserve-3d;
            transform: ${transform};
            /*transform: translate3d(-130px, -100px, 20px) scale3d(0.3, 0.3, 0.3) rotate3d(1, 0, 0, 90deg) rotate3d(0, 1, 0, -180deg) rotate3d(0, 0, 1, 0deg);*/
            animation: particle-death-play ${t}ms 1000ms steps(${frames}) infinite;
        }
        @keyframes particle-death-play { 
            0% {
                background-image: url(${url});
                background-position:    0px 0;
            }
            100% { background-position: -${wide}px 0; }
        }
    `;
    document.querySelector('head').appendChild(style);
};
function particleDeath(input) {
    let particle = document.createElement('div');
    let target = input.events.save.target;
    let targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`].sihdre.data;
    let targetParentNode = targetModel.asset.parentNode;
    let cellSize = graphicsGlobalSettings.cellSize - 5;

    url = input.view.getRes().images.death;
    transform = `
        translate3d(${targetModel.axis.x.translate - cellSize}px, ${targetModel.axis.y.translate - cellSize}px, ${targetModel.axis.z.translate + cellSize}px) 
        rotate3d(1, 0, 0, 90deg) 
        rotate3d(0, 1, 0, -80deg) 
        rotate3d(0, 0, 1, 180deg)
    `;
    appendStyle();
    particle.classList.add('particle-death');
    targetParentNode.parentNode.insertBefore(particle, targetParentNode.nextSibling);
    requestTimeout(() => {
        //particle.remove();
        //style.remove();
    }, t);
};
export {
    particleDeath
}