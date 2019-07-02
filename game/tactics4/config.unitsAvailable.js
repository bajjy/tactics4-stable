import { Fighter } from './unit/unit.fighter.js'
import { Brute } from './unit/unit.brute.js'
import { Shooter } from './unit/unit.shooter.js'
import { Witch } from './unit/unit.witch.js'

var unitsAvailable = {
    Fighter: Fighter,
    Brute: Brute,
    Shooter: Shooter,
    Witch: Witch
};

export {
    unitsAvailable
}