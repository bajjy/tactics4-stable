import { animationAvailable } from '../config.animationAvailable.js';
import { effectGlobalSettings } from '../config.effectGlobalSettings.js';

function runEffect(input) {
    let game = input.effect.game;
    let effect = input.effect;
    let state = input.state;
    let settings = effectGlobalSettings[effect.title];
    let changed = game['changed'] || 0;
    let animation = settings.animation || ['empty'];
    effect['effect'] = effect
    //if (!settings.animation && effect.action(effect)) return effect.affected.push(effect);
    if (effect.action(effect)) return effect.affected.push(effect);
    //animation.map(ani => {
        //changed += animationAvailable[ani](effect).timer;
        //game.animation.actor(() => {
            if (effect.action(effect)) return effect.affected.push(effect);
        //}, effect, effect.title, changed);
    //});
    game['changed'] += changed;
};

function checkEffect(input) {
    let game = input.game;
    console.log('//////////////////////////////////////////////////////////////////////////////////')
    console.log('//////////////////////////////////////////////////////////////////////////////////')
    //if savings is effect, then run with animation
    game.savings.map(memo => {
        let effect = effectGlobalSettings[memo.effect.title];
        if (effect) runEffect(memo);
    });
    game.savings = [];
    // actions.some(el => {
    //     if (el.title == 'move') {
    //         return input.game.action({
    //             game: input.game,
    //             client: input.game.TurnMachine.who(),
    //             target: input.events.save.unit,
    //             task: el,
    //             setup: {
    //                 path: input.events.save.search,
    //                 effectsMap: input.game.effects.map
    //             }
    //         });
    //     };
    // });

    // changed = animationAvailable.movement(input, model);

    // //renew interface
    // if (!changed) return hudCancelSkill(input);
    // input['changed'] = changed;
    // input.game.animation.actor(() => {
    //     return hudCancelSkill(input);
    // }, unit, 'interfaceMoveUnitAction', changed.timer);

    // if (input.events.save.unit) unit = input.events.save.unit.getState();
    // if (input.events.save.target) target = input.events.save.target.getState();

    // if (unit != false && target != false) return isTargetHited(input);
    
};

export {
    checkEffect
}