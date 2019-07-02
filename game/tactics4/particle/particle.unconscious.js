var style = document.createElement('style');
style.id = 'particleUnconscious';
var t = 1000;
var w = 50;
var h = 50;
var frames = 15;
var wide = frames * w;
var url;
var transform = ``;

function appendStyle() {
    style.innerHTML += `
        .particle-unconscious {
            position: absolute;
            width: ${w}px;
            height: ${h}px;
            background-image: url(${url});
            background-size: cover;
            transform-style: preserve-3d;
            transform: ${transform};
            /*transform: translate3d(-130px, -100px, 20px) scale3d(0.3, 0.3, 0.3) rotate3d(1, 0, 0, 90deg) rotate3d(0, 1, 0, -180deg) rotate3d(0, 0, 1, 0deg);*/
            animation: particle-unconscious-play ${t}ms steps(${frames}) infinite;
        }
        @keyframes particle-unconscious-play { 
            0% { background-position:    0px 0; } 
            100% { background-position: -${wide}px 0; }
        }
    `;
    document.querySelector('head').appendChild(style);
};
function particleUnconscious(input) {
    let particle = document.createElement('div');
    let target = input.events.save.target;
    let targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`].sihdre.data;
    let targetParentNode = targetModel.asset.parentNode;
    let scene = input.game.view.getRender().scene.map.sihdre.data;

    url = input.view.getRes().liquid_029_splash;
    transform = `
        translate3d(${targetModel.axis.x.translate}px, ${targetModel.axis.y.translate}px, ${targetModel.axis.z.translate + 20}px) 
        rotate3d(1, 0, 0, ${scene.axis.x.angle}deg) 
        rotate3d(0, 1, 0, ${scene.axis.y.angle}deg) 
        rotate3d(0, 0, 1, ${20 - scene.axis.z.angle}deg)
    `;
    appendStyle();
    particle.classList.add('particle-unconscious');
    targetParentNode.parentNode.insertBefore(particle, targetParentNode.nextSibling);
    requestTimeout(() => {
        particle.remove();
        style.remove();
    }, t);
};
export {
    particleUnconscious
}