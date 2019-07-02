import { eventAvailable } from './module.level1.eventAvailable.js';
import { Camera, Scene } from './class.scenecast.js';
import { graphicsGlobalSettings } from './config.graphicsGlobalSettings.js';
import { cameraXray } from './fx/fx.cameraXray.js';
import { cameraLight } from './fx/fx.cameraLight.js';
import { moveCamera } from './animation/animation.moveCamera.js';
import * as fetchmodel from './lib.fetchmodel.js';

const errorScenarioIndex = 5;

var game;
var graphics;
var resources;
var cursor;
var camera1 = new Camera();
var scene = new Scene();
var hud = new Scene();
var hudActions = new Scene();
var thevoid = new Scene();
var bg = new Scene();
var tpl = `
    <h1>SOMETHING WENT WRONG</h1>
    <a href="/">restart</a>
`;

var render = {
    thevoid: {
        sihdre: {
            data: thevoid,
            render: [thevoid.csscast]
        }
    },
    scene :{
        sihdre: {
            data: camera1,
            render: [camera1.cut],//cameraXray
            renderSetup: {
                // fxXRAY: {
                //     target: graphicsGlobalSettings.renderSetup.fxXRAY.target
                // }
            }
        },
        map: {
            sihdre: {
                data: scene,
                render: [scene.csscast]
            },
            bg: {
                sihdre: {
                    data: bg,
                    render: [bg.csscast]
                }
            }
        }
    },
    hud: {
        sihdre: {
            data: hud,
            render: [hud.csscast]
        }
    },
    hudActions: {
        sihdre: {
            data: hudActions,
            render: [hudActions.csscast]
        }
    }
};

class View {
    constructor(input) {
        var height;
        var width;
        var hudActionsY;
        var hudActionsX;

        game = input.game;
        graphics = input.graphics;
        resources = input.resources;
        cursor = input.cursor;
        hudActionsY = cursor.offsetHeight - graphicsGlobalSettings.hudActions.height;
        hudActionsX = cursor.offsetWidth - graphicsGlobalSettings.hudActions.width;

        this.handling = ['markers', 'unit'];
        this.diff = [];

        //setup camera
        camera1.setScene(scene);
        camera1.size.width = cursor.offsetWidth;
        camera1.size.height = cursor.offsetHeight;
        camera1.size.depth = graphicsGlobalSettings.sceneDepth;

        //going to be replaced with scenario
        bg.size.width = cursor.offsetWidth;
        bg.size.height = cursor.offsetHeight;
        
        thevoid.size.width = 0;
        thevoid.size.height = 0;

        this.rebuildCells();
        game.players.list.map((currentPlayer, pIndex) => {
            currentPlayer.units.map((currentUnit, uIndex) => {
                this.addUnit(currentUnit, pIndex, uIndex);
            });
        });

        graphics.setData(render);

        camera1.axis.x.angle = graphicsGlobalSettings.startCamera.x.angle;
        camera1.axis.z.angle = graphicsGlobalSettings.startCamera.z.angle;
        camera1.axis.y.angle = 0;
        camera1.axis.z.translate = graphicsGlobalSettings.startCamera.z.translate;
        camera1.axis.x.translate = graphicsGlobalSettings.startCamera.x.translate;
        camera1.axis.y.translate = graphicsGlobalSettings.startCamera.y.translate;

        bg.axis.x.angle = 0;
        bg.axis.z.angle = 0;
        bg.axis.y.angle = 0;
        bg.axis.z.translate = graphicsGlobalSettings.bg.z.translate;
        bg.axis.x.translate = -bg.size.width;
        bg.axis.y.translate = -bg.size.height;
        
        hud.axis.y.translate = 0;
        hud.axis.x.translate = 0;
        hud.size.width = 0;
        hud.size.height = 0;

        if (hudActionsX > graphicsGlobalSettings.medias.hd) hudActionsX = graphicsGlobalSettings.medias.hd - graphicsGlobalSettings.hudActions.width;
        hudActions.axis.y.translate = hudActionsY;
        hudActions.axis.x.translate = hudActionsX;

        if (cursor.offsetWidth <= graphicsGlobalSettings.medias.landscape) {
            //camera1.size.width = cursor.offsetWidth / 2;
            //camera1.size.height = cursor.offsetHeight / 2;
            //camera1.axis.y.translate = cursor.offsetHeight;
        };

        camera1.connect(this.getCell(graphicsGlobalSettings.startCamera.target).sihdre.data);
        camera1.connection();

        this.draw();

        var lastX;
        var currentX;
        
        window.addEventListener('touchstart', (e) => {
            currentX = e.changedTouches[0].screenX;
            lastX = currentX;
        });
        
        window.addEventListener('touchend', (e) => {
            cursor.classList.remove('scroll')
        });
        
        window.addEventListener('touchmove', (e) => {
            currentX = e.changedTouches[0].screenX;
            let delta = currentX - lastX;
            //cursor.classList.add('scroll')
            camera1.axis.x.translate -= delta * -1;
            lastX = currentX;

            this.draw();
        });
        window.addEventListener('dblclick', event => {
            //camera1.axis.z.translate -= 100; //z
            //window.bw()
            //this.draw();
        });
    
    };
    add(input) {
        if (input) this.diff.push(input);
    };
    commit() {
        for (let i in this.diff) {
            let el = this.diff[i][this.diff[i]['type']];
            for (let chunk in el) {
                let renderZone = render[this.diff[i]['type']] || render.scene[this.diff[i]['type']];
                renderZone[chunk] = el[chunk];
            };
        };
    };
    push() {
        this.diff = [];
    };
    purgeHud(target) {
        for (let i in this.diff) {
            let el = this.diff[i][this.diff[i]['type']];

            for (let chunk in el) {
                if (target && el[chunk].sihdre.type != target) return;
                let renderZone = render[this.diff[i]['type']] || render.scene[this.diff[i]['type']];
                delete renderZone[chunk];
                delete this.diff[i]
            };
        };
    };
    purge(target) {
        let effectToRemove = [];
        for (let key in render.scene.map) {
            if (key.toLowerCase().indexOf('effect') > -1) {
                let rm = false;
                let effect = render.scene.map[key].sihdre;
                let yx = render.scene.map[key].sihdre.yx.join(',');

                if (game.effects.list.get(yx)) {
                    game.effects.list.get(yx).map(item => {
                        if (effect.genuine == item) rm = true
                    });
                    if (!rm) effectToRemove.push(key);
                };
            }
        };
        for (let key in render.scene.map) {
            if (key.toLowerCase().indexOf('unit') > -1 && render.scene.map[key].sihdre.type == 'unit') {
                let rm = false;
                let unit = render.scene.map[key].sihdre.genuine.getState();
                let pu = `unit_${unit.player}_${unit.index}`; //p-layer u-nit

                game.players.list.map((currentPlayer, pIndex) => {
                    currentPlayer.units.map((currentUnit, uIndex) => {
                        if (pu == `unit_${pIndex}_${uIndex}`) rm = true;
                    });
                });
                if (!rm) effectToRemove.push(key);
            };
        };
        effectToRemove.map(item => delete render.scene.map[item]);
        for (let i in this.diff) {
            let el = this.diff[i][this.diff[i]['type']];

            for (let chunk in el) {
                if (target && el[chunk].sihdre.type != target) return;
                let renderZone = render[this.diff[i]['type']] || render.scene[this.diff[i]['type']];
                delete renderZone[chunk];
                delete this.diff[i]
            };
        };
        if (!target) this.diff = [];
    };
    draw(input) {
        var a = performance.now();

        graphics.draw(input);
        console.log(performance.now() - a, '----------');
    };
    getCell(yx) {
        var cell = Object.assign({}, render.scene.map[yx.join(',')]);
        game.players.list.map((currentPlayer, pIndex) => {
            currentPlayer.units.map((currentUnit, uIndex) => {
                let loc = currentUnit.getState().location;
                if (loc[0] == yx[0] && loc[1] == yx[1]) {
                    cell['unit'] = currentUnit
                };
            });
        });
        return cell;
    };
    getRender() {
        return render
    };
    getRes(resource) {
        return resource ? resources[resource] : resources
    };
    getCursor() {
        return cursor
    };
    rebuildCells() {
        var height = game.land.graph.grid.length;
        var width = game.land.graph.grid[0].length;

        for (let value in render.scene.map) {
            let elem = render.scene.map[value];
            if (elem && elem.sihdre && elem.sihdre.type == 'cell') delete render.scene.map[value]
            if (elem && elem.sihdre && elem.sihdre.type == 'effect') delete render.scene.map[value]
        };
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let cellScene = new Scene();
                let cellEffects = game.effects.list.get(y + ',' + x);

                render.scene.map[y + ',' + x] = {
                    sihdre: {
                        type: 'cell',
                        data: cellScene,
                        render: [cellScene.csscast],
                        yx: [y, x]
                    }
                };

                cellScene.size.width = graphicsGlobalSettings.cellSize;
                cellScene.size.height = graphicsGlobalSettings.cellSize;
                cellScene.axis.y.translate = (graphicsGlobalSettings.cellSize * y) - (graphicsGlobalSettings.cellSize / 4) * y;
                cellScene.axis.x.translate = (graphicsGlobalSettings.cellSize * x) - (graphicsGlobalSettings.cellSize / 2) * y;

                if (cellEffects) {
                    cellEffects.map((currentEffect, eIndex) => {
                        this.addEffect(currentEffect, y, x, eIndex);
                    })
                };
            }
        };
    };
    addUnit(currentUnit, pIndex, uIndex) {
        let loc = currentUnit.getState().location;
        let unitScene = new Scene();
        let y = render.scene.map[loc[0] + ',' + loc[1]].sihdre.data.axis.y.translate;
        let x = render.scene.map[loc[0] + ',' + loc[1]].sihdre.data.axis.x.translate;

        unitScene.setAsset(fetchmodel.modelize(resources[currentUnit.getState().title]));
        render.scene.map[`unit_${pIndex}_${uIndex}`] = {
            sihdre: {
                type: 'unit',
                data: unitScene,
                render: [unitScene.csscast, unitScene.model],
                genuine: currentUnit,
                path: `${pIndex},${uIndex}`,
                status: ['idle']
            }
        };
        unitScene.size.width = graphicsGlobalSettings.cellSize;
        unitScene.size.height = graphicsGlobalSettings.cellSize;
        unitScene.size.depth = graphicsGlobalSettings.cellSize;
        unitScene.axis.y.translate = y;
        unitScene.axis.x.translate = x;
        unitScene.axis.z.angle = 0;
        unitScene.center();
    };
    addEffect(currentEffect, y, x, eIndex) {
        let effectScene = new Scene();
        let asset = graphicsGlobalSettings.assets[currentEffect.title];

        if (asset) effectScene.setAsset(fetchmodel.modelize(resources[asset]));

        render.scene.map[`effect_${y},${x}_${eIndex}`] = {
            sihdre: {
                type: 'effect',
                data: effectScene,
                render: [effectScene.csscast, effectScene.model],
                genuine: currentEffect,
                yx: [y, x],
                age: 0,
                status: ['idle']
            }
        };

        //setup, a func maybe wich is going to regulate appirance of the model
        //effectScene.axis.z.angle = Math.random() * 360;
        effectScene.size.width = graphicsGlobalSettings.cellSize;
        effectScene.size.height = graphicsGlobalSettings.cellSize;
        effectScene.size.depth = graphicsGlobalSettings.cellSize;
        effectScene.axis.y.translate = (graphicsGlobalSettings.cellSize * y) - (graphicsGlobalSettings.cellSize / 4) * y;
        effectScene.axis.x.translate = (graphicsGlobalSettings.cellSize * x) - (graphicsGlobalSettings.cellSize / 2) * y;

        effectScene.center();
    };
};

class Events {
    constructor(input) {
        this.state;
        this.save = {};
        this.main = input.main;
        this.game = input.game;
        this.view = input.view;
        this.scenario = input.scenario;
        this.handler;

        window.addEventListener("error", e => {
            this.view.purge();
            this.scenario.index = errorScenarioIndex;
            this.scenario.move();
            this.main.removeEventListener('mousedown', this.handler);
            this.setState('endScreen');
         })
    };
    setMouseEvent(event) {
        event.path.some(el => {
            if (el.dataset && el.dataset.sihdreCell || el.dataset && el.dataset.sihdreHudKey) {
                //var yx = [el.dataset.sihdreY, el.dataset.sihdreX];
                eventAvailable[this.state]({
                    game: this.game,
                    view: this.view,
                    scenario: this.scenario,
                    events: this,
                    event: event,
                    el: el
                });
            };
        });
    };
    setEvent(input) {
        if (this.handler) this.main.removeEventListener(input.type, this.handler);
        this.main.addEventListener(input.type, this.handler = event => this.setMouseEvent(event));
    }
    setState(state) {
        this.state = state;
        eventAvailable[this.state]({
            game: this.game,
            view: this.view,
            scenario: this.scenario,
            events: this
        });
    };
    unset(input) {
        this.main.removeEventListener(input.type, this.handler);
    };
};

function uiFixed(input) {
    var view = input.view.getRender();
    var camera1 = view.scene.sihdre.data;
    var leftArrow = document.querySelector('.ui.left');
    var rightArrow = document.querySelector('.ui.right');

    leftArrow.addEventListener('click', () => {
        moveCamera(input, {
            x: { translate: 50 }
        })
    });
    rightArrow.addEventListener('click', () => {
        moveCamera(input, {
            x: { translate: -50 }
        })
    });

    console.log(view)
// window.addEventListener('wheel', e => {
//     //camera1.axis.z.angle += e.deltaY % 10;
//     //this.draw();
// });
// window.addEventListener('wheel', e => {
//     let d = e.deltaX;
//     if (Math.abs(e.deltaX) < 1) d = e.deltaX * 20;
//     if (Math.abs(e.deltaX) > 10) d = e.deltaX / 5;

//     camera1.axis.x.translate -= d;
//     this.draw();
// });
// window.addEventListener('keydown', e => {
//     if (e.keyCode == 82) camera1.axis.x.angle += 10; //r
//     if (e.keyCode == 70) camera1.axis.x.angle -= 10; //f
//     if (e.keyCode == 81) camera1.axis.z.angle -= 10; //q
//     if (e.keyCode == 69) camera1.axis.z.angle += 10; //e

//     if (e.keyCode == 65) camera1.axis.x.translate += 10; //a
//     if (e.keyCode == 68) camera1.axis.x.translate -= 10; //d

//     if (e.keyCode == 90) camera1.axis.z.translate -= 10; //z
//     if (e.keyCode == 88) camera1.axis.z.translate += 10; //x

//     this.draw();
// });
};
export {
    View,
    Events,
    uiFixed
}

