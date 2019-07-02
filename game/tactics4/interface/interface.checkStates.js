import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function isTargetHited(input) {
    var unit = input.events.save.unit.getState();
    var targetCurrState = input.events.save.target.getState();
    var targetPrevState = input.events.save.target.states[input.events.save.target.states.length - 2];
    var statuses = effectGlobalSettings[targetPrevState.controller].statuses.ls;
    
    if (targetPrevState.status == statuses[0] && targetCurrState.status == statuses[1]) return animationAvailable.unconscious(input);
    if (targetPrevState.status == statuses[1] && targetCurrState.status == statuses[0]) return animationAvailable.resurrect(input);
    if (targetCurrState.status == statuses[2]) return animationAvailable.death(input);
    return false
};
function checkStates(input) {
    var unit;
    var target;

    if (input.events.save.unit) unit = input.events.save.unit.getState();
    if (input.events.save.target) target = input.events.save.target.getState();

    if (unit != false && target != false) return isTargetHited(input);
    
};

export {
    checkStates
}