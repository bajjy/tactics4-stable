var effectGlobalSettings = {
    statusControllerOrganism: {
        cost: 0,
        statuses: {
            ls: ['alive', 'unconscious', 'death'],
            hp: {
                '1': 'alive',
                '0': 'unconscious',
                '-1': 'death'
            },
            status: {
                alive: {},
                unconscious: {
                    turns: 0,
                    speed: 0
                },
                death: 'destroy'
            }
        }
    },
    statusControllerLowOrganism: {
        cost: 0,
        statuses: {
            ls: ['alive', 'death'],
            hp: {
                '0': 'alive',
                '-1': 'death'
            },
            status: {
                alive: {},
                death: 'destroy'
            }
        }
    },
    cancelSelectUnit: {
        text: () => `
            <strong>Deselect unit</strong>
            <p>
                You can select new unit
            </p>
        `
    },
    actionPlayerFinishesTurn: {
        cost: 0,
        reacts: ['segment', 'transfer'],
        autorun: ['dwelling'],
        text: () => `
            <strong>Finish turn</strong>
            <p>
                Current player finish a turn
            </p>
        `
    },
    epicMessage: {
        text: 'new day has begun',
        cost: 0
    },
    move: {
        cost: 1,
        reacts: ['slow', 'swamp'],
        disabled: ['unconscious'],
        endBlockers: ['dwelling'],
        text: () => `
            <strong>Move unit</strong>
            <p>
                Unit moving cell by cell to target point 
            </p>
        `
    },
    thrust: {
        radius: 1,
        amount: 1,
        cost: 1,
        chance: 6,
        reacts: ['fort', 'platform'],
        nochance: ['unconscious'],
        disabled: ['unconscious'],
        text: (chance) => `
            <strong>Thrust</strong>
            <p>
                Hit target unit with <span class='red'>${100}%</span>  
            </p>
        `
    },
    shot: {
        radius: 2,
        amount: 1,
        cost: 1,
        chance: 6,
        reacts: ['fort', 'platform'],
        nochance: ['unconscious'],
        blockers: ['mountain'],
        disabled: ['unconscious'],
        text: (chance) => `
            <strong>Shot</strong>
            <p>
                Hit target on range 3 with <span class='red'>${100}%</span>  
            </p>
        `
    },
    regenerate: {
        amount: 1,
        cost: 0,
        disabled: ['alive'],
        text: () => `
            <strong>Regenerate</strong>
            <p>
                Use before move. Unit heal his injury automatically
            </p>
        `
    },
    slow: {
        amount: 1,
        cost: 1,
        weight: 0.5,
        ending: ['rounds', {amount: 0}], //-1, -2
        text: () => `
            <strong>Slow</strong>
            <p>
                If unit stands on "slow", his path going to be cut to 1 cell.
                Effect last 1 round
            </p>
        `
    },
    mountain: {
        weight: 0,
        ending: ['endless', {}],
        text: () => `
            <strong>Mountain</strong>
            <p>
                Mountains blocks movement or shooting
            </p>
        `
    },
    incognita: {
        weight: 0,
        ending: ['neighbour', {segment: {closed: false}}]
    },
    terra: {
        weight: 1,
        size: [4, 4],
        ending: ['endless', {}]
    },
    segment: {
        exploring: 1,
        ending: ['endless', {}]
    },
    transfer: {
        //animation: ['transfer'],
        runAnimation: ['movementStyles'],
        cancelAnimation: ['movement', 'movementStyles'],
        ending: ['endless', {}],
        text: () => `
            <strong>Transfer</strong>
            <p>
                If unit finishes turn standing on this effect, its going to be transfered to another location 
            </p>
        `
    },
    dwelling: {
        weight: 1,
        ending: ['endless', {}],
        text: () => `
            <strong>Dwelling</strong>
            <p>
                Release enemy creature
            </p>
        `
    },
    swamp: {
        amount: 1,
        weight: 1,
        ending: ['endless', {}],
        text: () => `
            <strong>Swamp</strong>
            <p>
                If unit stands on "swamp", his path going to be cut to 1 cell.
                Effect is endless
            </p>
        `
    },
    water: {
        weight: 0,
        ending: ['endless', {}],
        text: () => `
            <strong>Water</strong>
            <p>
                Blocks movement
            </p>
        `
    },
    platform: {
        amount: -3,
        weight: 1.1,
        ending: ['endless', {}],
        text: () => `
            <strong>Platform</strong>
            <p>
                Gives unit <span class='red'>50%</span> chance to survive against close and range attacks
            </p>
        `
    },
    fort: {
        amount: -5,
        weight: 1.2,
        ending: ['endless', {}],
        text: () => `
            <strong>Fort</strong>
            <p>
                Gives unit <span class='red'>83%</span> chance to survive against close and range attacks
            </p>
        `
    },
    aiActivation: {
        cost: 0,
        cancelAnimation: ['movement', 'movementStyles'],
        text: () => ''
    }
};

export {
    effectGlobalSettings
}