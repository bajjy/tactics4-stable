import { mountain } from './func/func.mountain.js'
import { move } from './func/func.move.js'
import { slow } from './func/func.slow.js'
import { thrust } from './func/func.thrust.js'
import { shot } from './func/func.shot.js'
import { epicMessage } from './func/func.epic.message.js'
import { segment } from './func/func.segment.js'
import { incognita } from './func/func.incognita.js'
import { transfer } from './func/func.transfer.js'
import { dwelling } from './func/func.dwelling.js'
import { swamp } from './func/func.swamp.js'
import { water } from './func/func.water.js'
import { platform } from './func/func.platform.js'
import { fort } from './func/func.fort.js'
import { aiActivation } from './func/func.aiActivation.js'
import { regenerate } from './func/func.regenerate.js'
import { actionPlayerFinishesTurn } from './func/func.actionPlayerFinishesTurn.js'
import { statusControllerOrganism } from './func/func.statusControllerOrganism.js'
import { statusControllerLowOrganism } from './func/func.statusControllerLowOrganism.js'

var effectsAvailable = {
    statusControllerOrganism: statusControllerOrganism,
    statusControllerLowOrganism: statusControllerLowOrganism,
    actionPlayerFinishesTurn: actionPlayerFinishesTurn,
    epicMessage: epicMessage,
    move: move,
    slow: slow,
    thrust: thrust,
    shot: shot,
    mountain: mountain,
    incognita: incognita,
    segment: segment,
    transfer: transfer,
    dwelling: dwelling,
    swamp: swamp,
    water: water,
    platform: platform,
    fort: fort,
    aiActivation: aiActivation,
    regenerate: regenerate
};

export {
    effectsAvailable
}