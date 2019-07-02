var graphicsGlobalSettings = {
    cellSize: 64,
    sceneDepth: 1000,
    bg: {
        z: {
            translate: 0
        }
    },
    medias: {
        mobile: 600,
        portrait: 900,
        landscape: 1200,
        hd: 1600,
        fullhd: 1800,
        full4k: 2560
    },
    startCamera: {
        target: [0, 0],
        x: {
            angle: 60,
            translate: 850
        },
        z: {
            angle: -120,
            translate: 600
        },
        y: {
            translate: 450
        }
    },
    assets: {
        mountain: 'rectangle',
        dwelling: 'dwelling',
        transfer: 'transfer',
        swamp: 'swamp',
        water: 'water',
        platform: 'platform',
        fort: 'fort'
    },
    renderSetup: {
        fxXRAY: {
            target: ['[data-sihdre-effect] .body .part.torso .part']
        },
        fxLIGHT: {
            target: ['[data-sihdre-effect] .body .part.torso .part', '[data-sihdre-unit] .body .part.torso .part']
        }
    },
    markers: {
        default: {
            hoverZ: 40,
            width: 20,
            height: 20,
            x: 90,
            y: 120,
            z: 0
        }
    },
    hudActions: {
        height: 150,
        width: 150
    },
    tip: {
        size: 50
    }
};

export {
    graphicsGlobalSettings
}