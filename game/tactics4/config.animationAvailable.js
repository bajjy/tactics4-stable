import { startScreenCam } from './animation/animation.startScreenCam.js'
import { endStartScreen } from './animation/animation.endStartScreen.js'
import { endScreenCam } from './animation/animation.endScreenCam.js'
import { movement } from './animation/animation.movement.js'
import { zoomToPoint } from './animation/animation.zoomToPoint.js'
import { moveToPoint } from './animation/animation.moveToPoint.js'
import { transfer } from './animation/animation.transfer.js'
import { thrust } from './animation/animation.thrust.js'
import { unconscious } from './animation/animation.unconscious.js'
import { resurrect } from './animation/animation.resurrect.js'
import { death } from './animation/animation.death.js'
import { empty } from './animation/animation.empty.js'

var animationAvailable = {
    endScreenCam: endScreenCam,
    startScreenCam: startScreenCam,
    endStartScreen: endStartScreen,
    movement: movement,
    zoomToPoint: zoomToPoint,
    moveToPoint: moveToPoint,
    transfer: transfer,
    thrust: thrust,
    unconscious: unconscious,
    resurrect: resurrect,
    death: death,
    empty: empty
};

export {
    animationAvailable
}