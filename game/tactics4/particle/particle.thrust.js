var style = document.createElement('style');
style.id = 'particleThrust';
var t = 1000;
var w = 100;
var h = 100;
var frames = 21;
var wide = frames * w;
var url;
var transform = ``;

function appendStyle() {
    style.innerHTML += `
        .particle-thrust {
            position: absolute;
            width: ${w}px;
            height: ${h}px;
            background-image: url(${url});
            background-size: cover;
            transform-style: preserve-3d;
            transform: ${transform};
            /*transform: translate3d(-130px, -100px, 20px) scale3d(0.3, 0.3, 0.3) rotate3d(1, 0, 0, 90deg) rotate3d(0, 1, 0, -180deg) rotate3d(0, 0, 1, 0deg);*/
            animation: particle-thrust-play ${t}ms steps(${frames}) infinite;
        }
        @keyframes particle-thrust-play { 
            0% { background-position:    0px 0; } 
            100% { background-position: -${wide}px 0; }
        }
    `;
    document.querySelector('head').appendChild(style);
};
function particleThrust(input) {
    let particle = document.createElement('div');
    let unit = input.events.save.unit;
    let target = input.events.save.target;
    let unitModel = input.game.view.getRender().scene.map[`unit_${unit.getState().player}_${unit.getState().index}`].sihdre.data;
    let targetModel = input.game.view.getRender().scene.map[`unit_${target.getState().player}_${target.getState().index}`].sihdre.data;
    let unitParentNode = targetModel.asset.parentNode;

    url = input.view.getRes().smoke_003_up;
    transform = `
        translate3d(${targetModel.axis.x.translate}px, ${targetModel.axis.y.translate}px, ${targetModel.axis.z.translate + 20}px) 
        rotate3d(1, 0, 0, ${0}deg) 
        rotate3d(0, 1, 0, ${90}deg) 
        rotate3d(0, 0, 1, ${20 - unitModel.axis.z.angle}deg)
    `;
    appendStyle();
    particle.classList.add('particle-thrust');
    unitParentNode.parentNode.insertBefore(particle, unitParentNode.nextSibling);
    requestTimeout(() => {
        particle.remove();
        style.remove();
    }, t);
};
export {
    particleThrust
}