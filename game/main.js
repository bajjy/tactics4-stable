import './shim.event-path-polyfill.js';
import './shim.raftimer.js';
import * as level1 from './tactics4/module.level1.js'

window.settings = {
    navigator: 'default'
};
var main = document.querySelector('main');

level1.init(main);