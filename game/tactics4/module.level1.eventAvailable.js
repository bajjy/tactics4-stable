// var game;
// var render;
// var event;
// //current / old
// var state = [false, false];
// //current / old
// var cells = [false, false];
// var view;
// var viewState = {};
// var main;
// var draw;
// var update;
// var hudDefault = [
//     {
//         actionPlayerFinishesTurn: 'end turn'
//     }
// ];
// // eventAvailable.init({
//     //     game: game,
//     //     render: render,
//     //     view: view,
//     //     main: main,
//     //     draw: draw,
//     //     update: update
//     // });
// var eventInterface = {
//     cancelSelectUnit() {
//         render.hud.some((el, i) => {
//             if (el.cancelSelectUnit) {
//                 eventAvailable.undoSelectUnit();
//                 render.hud = hudDefault;
//                 //render.hud.splice(i, 1);
//                 return true
//             };
//         });
//         // for (let { cancelSelectUnit, unitActions } of render.hud) {

//         // };
//         setState('selectUnit');
//         return draw();
//     },
//     cancelSkill() {
//         render.hud.some((el, i) => {
//             if (el.cancelSkill) {
//                 eventAvailable.selectUnitHud();
//                 return true
//             };
//         });
//         setState('selectAction');
//         return draw();
//     },
//     move() {
//         var unit = viewState.selectUnit.unit.genuine.getState();
//         var area = game.land.around({yx: unit.location, radius: unit.speed});

//         area.map(cell => {
//             render.map[ cell[0] ][ cell[1] ].markers = ['area']
//         });
//         render.hud = [{cancelSkill: 'cancel', info: 'move'}];
//         setState('movePathfind');
//         return draw();
//     },
//     thrust() {
//         console.log('thrust')
//     },
//     actionPlayerFinishesTurn() {
//         var actions = game.getAvailableActions();
//         actions.some((el, i) => {
//             if (el.title == 'actionPlayerFinishesTurn') {
//                 game.action({
//                     game: game,
//                     client: game.TurnMachine.who(),
//                     target: game.TurnMachine.who(),
//                     task: el,
//                     setup: {}
//                 });
//                 eventAvailable.undoSelectUnit();
//                 render.hud = hudDefault;
//                 return true
//             };
//         });
//         setState('selectUnit');
//         return draw();
//     }
// };

// var eventAvailable = {
//     init(input) {
//         game = input.game;
//         render = input.render;
//         view = input.view;
//         main = input.main;
//         draw = input.draw;
//         update = input.update;
//         update();
//         render.hud = hudDefault;
//         setState('selectUnit');
//         //default event to select cells
//         main.addEventListener('mousedown', event => eventAvailable.setMouseDownEvent(event));
//     },
//     setMouseDownEvent(event) {
//         event.path.some(el => {
//             if (el.dataset && el.dataset.sihdreCell) {
//                 var yx = [el.dataset.sihdreY, el.dataset.sihdreX];
//                 cells[1] = cells[0];
//                 cells[0] = yx;
//                 if (cells[0] && state[0]) {
//                     eventAvailable[state[0]](event);
//                 };
//                 return draw();
//             };
//             if (el.dataset && el.dataset.sihdreHudKey) {
//                 var hudKey = el.dataset.sihdreHudKey;
//                 var hudVal = el.dataset.sihdreHudValue;
//                 if (eventAvailable[hudKey]) return eventAvailable[hudKey](); 
//                 if (eventInterface[hudKey]) return eventInterface[hudKey](); 
//             };
//         });
//     },
//     selectUnit() {
//         var cell = render.map[cells[0][0]][cells[0][1]];
//         var unit = cell['unit'];
//         eventAvailable.undoSelectUnit();
//         if (unit) {
//             if (unit.genuine.getState().player == game.TurnMachine.who().index) {
//                 unit.status.push('selectedUnit');
//                 setView({
//                     cell: cells[0],
//                     view: view,
//                     setup: {
//                         selectedUnit: cells[0].join(',')
//                     }
//                 });
//                 viewState['selectUnit'] = {unit: unit};
//                 eventAvailable.selectUnitHud();
//                 return setState('selectAction')
//             };
//             console.log(`this ${unit.genuine.getState().title} is not selectable`);
//             return draw();
//         };
//         console.log(`no unit in ${cells[0].join(', ')}`);
//     },
//     selectUnitHud() {
//         var unit = viewState.selectUnit.unit;
//         var actions = game.getAvailableActions({index: unit.genuine.getState().index});
//         render.hud = [{cancelSelectUnit: 'cancel'}];
//         for (let [index, value] of actions.entries()) {
//             render.hud.push({[value.title]: index});
//         };
//     },
//     undoSelectUnit() {
//         if (!view.has('selectedUnit')) return false;
//         view.get('selectedUnit').map(item => {
//             var cell = item.split(',');
//             if (render.map[ cell[0] ][ cell[1] ].unit) {
//                 var index = render.map[ cell[0] ][ cell[1] ].unit.status.indexOf('selectedUnit');
//                 render.map[ cell[0] ][ cell[1] ].unit.status.splice(index, 1);
//             };
//         });
//         view.delete('selectedUnit');
//         delete viewState.selectUnit
//     },
//     selectAction() {
//         console.log(view)
//     },
//     movePathfind() {
//         var search = game.land.search( viewState.selectUnit.unit.genuine.getState().location.concat(cells[0]) );
//         eventInterface.move();
//         search.map(cell => {
//             render.map[ cell.x ][ cell.y ].markers = ['search']
//         });
//     }
// };

// function setState(input) {
//     state[1] = state[0];
//     state[0] = input;
// };
// function setView(input) {
//     for (var item in input.setup) {
//         if (input.view.has(item)) return input.view.get(item).push(input.setup[item]);
//         input.view.set(item, [input.setup[item]]);
//     };
// };
import { startScreen } from './interface/interface.startScreen.js';
import { distribution } from './interface/interface.distribution.js';
import { selectUnitAction } from './interface/interface.selectUnitAction.js';
import { moveUnitAction } from './interface/interface.moveUnitAction.js';
import { thrustUnitAction } from './interface/interface.thrustUnitAction.js';
import { shotUnitAction } from './interface/interface.shotUnitAction.js';
import { regenerateUnitAction } from './interface/interface.regenerateUnitAction.js';
import { endScreen } from './interface/interface.endScreen.js';
import { transferUnit } from './interface/interface.transferUnit.js';

var eventAvailable = {
    startScreen: startScreen,
    distribution: distribution,
    selectUnitAction: selectUnitAction,
    moveUnitAction: moveUnitAction,
    thrustUnitAction: thrustUnitAction,
    shotUnitAction: shotUnitAction,
    regenerateUnitAction: regenerateUnitAction,
    endScreen: endScreen,
    transferUnit: transferUnit
};

export {
    eventAvailable
}
