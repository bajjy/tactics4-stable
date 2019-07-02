import { graphicsGlobalSettings } from './config.graphicsGlobalSettings.js';

var data;
var cursor;
var id = 0;
var types = {
    cell(input, tpl) {
        tpl.dataset.sihdreCell = '1';
        tpl.dataset.yx = input[0];
        //tpl.innerText = input[1].sihdre.seg;
    },
    unit(input, tpl) {
        tpl.dataset.sihdreUnit = '1';

        tpl.dataset.unitYx = input[1].sihdre.genuine.getState().location.join(',');
        if (input[1].sihdre.class && tpl.className != input[1].sihdre.class) tpl.className = input[1].sihdre.class;
        if (!input[1].sihdre.class) tpl.className = '';
    },
    effect(input, tpl) {

        tpl.dataset.sihdreEffect = '1';
        tpl.dataset.effectYx = input[1].sihdre.yx.join(',');

        tpl.className = 'effect' + ' ' + input[1].sihdre.genuine.title;
    },
    hud(input, tpl) {
        let render;
        let target;
        let modelSizes;
        let offsetX;
        let offsetY;
        //let modelSizes = document.querySelector('[data-key="10_0,1"]').getBoundingClientRect()

        tpl.dataset.sihdreHudKey = input[0];
        tpl.innerHTML = input[1].text;

        if (!input[1] || !input[1].sihdre.target) return true;
        render = input[1].sihdre.target;
        target = document.querySelector(input[1].sihdre.target);
        modelSizes = document.querySelector(input[1].sihdre.target).getBoundingClientRect();
        offsetX = input[1].sihdre.offsetX || graphicsGlobalSettings.cellSize;
        offsetY = input[1].sihdre.offsetY || 0;

        tpl.style.position = 'absolute';
        tpl.style.left = `${modelSizes.left + offsetX}px`;
        tpl.style.top = `${modelSizes.top + offsetY}px`;
        tpl.className = input[1].sihdre.class;
    },
    tip(input, tpl) {
        let render;
        let target;
        let modelSizes;
        let offsetX;
        let offsetY;
        let x;
        let y;
        let w;
        let h;

        tpl.dataset.sihdreHudKey = input[0];
        tpl.innerHTML = input[1].text;

        if (!input[1] || !input[1].sihdre.target) return true;

        render = input[1].sihdre.target;
        target = document.querySelector(input[1].sihdre.target);
        modelSizes = document.querySelector(input[1].sihdre.target).getBoundingClientRect();

        h = graphicsGlobalSettings.tip.size;
        w = graphicsGlobalSettings.tip.size;
        x = modelSizes.left + modelSizes.width / 2 - w / 2;
        y = modelSizes.top + modelSizes.height / 2 - h / 2 + 20;

        tpl.style.position = 'absolute';
        tpl.style.left = `${x}px`;
        tpl.style.top = `${y}px`;
        tpl.style.width = w + 'px';
        tpl.style.height = h + 'px';
        tpl.className = input[1].sihdre.class;
    },
    vector(input, tpl) {
        let render = input[1].sihdre.render;
        let target;
        let modelSizes;
        let cellSize = graphicsGlobalSettings.cellSize;
        let offsetX;
        let offsetY;
        let yx1;
        let y1;
        let x2;
        let y2;
        let w;
        let h;
        let vec = input[1].sihdre.vector;
        console.log(input[1].sihdre.vector)
        let points = [vec.path[0], vec.path[vec.path.length - 1]];

        tpl.dataset.sihdreHudKey = input[0];

        yx1 = document.querySelector(`[data-yx="${points[0].join(',')}"]`).getBoundingClientRect();
        console.log(input)
        tpl.style.width = `${2 * vec.length * cellSize}px`;
        tpl.style.left = `${yx1.left}px`;
        tpl.style.top = `${yx1.top}px`;
        tpl.className = input[1].sihdre.class;
        tpl.style.transformOrigin = `
            ${yx1.top}px ${yx1.left}px 0
        `;
        tpl.style.transform = `
            translate3d(0px, 0px, 0px)
            scale3d(1, 1, 1)
            rotate3d(1, 0, 0, ${0}deg)
            rotate3d(0, 1, 0, ${0}deg)
            rotate3d(0, 0, 1, ${vec.angle + render.scene.sihdre.data.axis.z.angle}deg)
        `;
    },
    marker(input, tpl) {
        //console.log(input[1].sihdre.render.sihdre.data.csscast([tpl]))
        let render = input[1].sihdre.render.sihdre.data;
        let width = input[1].sihdre.size ? input[1].sihdre.size.width : 1;
        let height = input[1].sihdre.size ? input[1].sihdre.size.height : 1;
        // tpl.style.transform = `
        //     translate3d(${render.axis.x.translate + render.size.width / 2}px, ${render.axis.y.translate + render.size.height / 2}px, ${render.axis.z.translate + 20}px)
        // `;
        tpl.style.transform = `
            translate3d(${render.axis.x.translate}px, ${render.axis.y.translate}px, ${render.axis.z.translate - 1}px)
            scale3d(${render.size.scale}, ${render.size.scale}, ${render.size.scale})
            rotate3d(1, 0, 0, ${render.axis.x.angle}deg)
            rotate3d(0, 1, 0, ${render.axis.y.angle}deg)
            rotate3d(0, 0, 1, ${render.axis.z.angle}deg)
        `;
        tpl.style.width = `${render.size.width * width}px`;
        tpl.style.height = `${render.size.height * height}px`;
        tpl.classList.add(input[1].sihdre.class)
    },
    hudMarker(input, tpl) {
        let render = input[1].sihdre.render.sihdre.data;
        let settings = graphicsGlobalSettings.markers[input[1].sihdre.settings] || graphicsGlobalSettings.markers['default'];

        tpl.dataset.sihdreHudKey = input[0];
        tpl.style.transform = `
            translate3d(${render.axis.x.translate}px, ${render.axis.y.translate}px, ${render.axis.z.translate + settings.hoverZ}px)
            scale3d(${render.size.scale}, ${render.size.scale}, ${render.size.scale})
            rotate3d(1, 0, 0, ${settings.x}deg)
            rotate3d(0, 1, 0, ${settings.y}deg)
            rotate3d(0, 0, 1, ${settings.z}deg)
        `;
        tpl.style.width = `${settings.width}px`;
        tpl.style.height = `${settings.height}px`;
        tpl.classList.add(input[1].sihdre.class)
    },

    sprite(input, tpl) {
        let render = input[1].sihdre.render.sihdre.data;

        tpl.style.transform = `
            translate3d(${0}px, ${0}px, ${-1000}px) 
            rotate3d(1, 0, 0, ${-render.axis.x.angle}deg)
            rotate3d(0, 1, 0, ${-render.axis.y.angle}deg)
            rotate3d(0, 0, 1, ${-render.axis.z.angle}deg)
        `;
        tpl.classList.add(input[1].sihdre.class)
    }
};
class Graphics {
    constructor() {
        this.nodeList = new Map();
        this.age = 0;
        this.events = {};
        this.exitCode = 'sihdre';
        this.mode = false;
    };
    setData(d) {
        data = d;
    };
    setCursor(c) {
        cursor = c;
    };
    draw(input) {
        if (input) this.mode = input;
        this.generateData();
    };
    * processData(data) {
        if (!data) {
            return;
        };
        for (let i in data) {
            var val = data[i];
            if (i == this.exitCode) {
                if (val.custom) yield this.cell(i, val, 1);
                yield this.render(i, val);
            } else if (typeof val === 'object') {
                //create div for current object
                cursor = this.cell(i, val);
                //fill it with object content
                yield* this.processData(val);
                //exit to parent div
                cursor = cursor.parentNode;
            } else {
                //console.log(val == old)
                yield this.cell(i, val);
            };
            ++id;
        };
    };
    render(key, value) {
        if (value.render) {
            for (var i = 0; i < value.render.length; i++) {
                value.render[i].call(value.data, [cursor, value]);
            };
        };
    };
    cell(key, value) {
        var tpl = cursor.querySelector(`[data-key="${id}_${key}"]`) || document.createElement('div');
        var valueType = Object.prototype.toString.call(value);

        if (this.nodeList.has(tpl)) {
            this.nodeList.delete(tpl);
        };

        this.nodeList.set(tpl, [cursor, key, this.age]);

        switch (valueType) {
            case '[object Object]':
                if (tpl.dataset.value == 'group' && tpl.dataset.type == 'object' && this.mode) return tpl

                tpl.dataset.key = `${id}_${key}`;
                tpl.dataset.kkey = key;
                tpl.dataset.value = 'group';
                tpl.dataset.type = 'object';

                if (value.sihdre && value.sihdre.type && types[value.sihdre.type]) types[value.sihdre.type]([key, value], tpl);
                break;
            case '[object Array]':
                if (tpl.dataset.value == 'group' && tpl.dataset.type == 'array' && tpl.dataset.valueLength == value.length) return tpl

                tpl.dataset.key = `${id}_${key}`;
                tpl.dataset.kkey = key;
                tpl.dataset.value = 'group';
                tpl.dataset.type = 'array';
                tpl.dataset.valueLength = value.length;

                if (value.sihdre && value.sihdre.type && types[value.sihdre.type]) types[value.sihdre.type]([key, value], tpl);
                break;
            default:
                if (tpl.dataset.value == (value + '') && typeof value == tpl.dataset.type && this.mode) return tpl

                tpl.dataset.key = `${id}_${key}`;
                tpl.dataset.kkey = key;
                tpl.dataset.value = value;
                tpl.dataset.type = typeof value;

                if (value.sihdre && value.sihdre.type && types[value.sihdre.type]) types[value.sihdre.type]([key, value], tpl);
        };
        return cursor.appendChild(tpl);
    };

    garbage() {
        this.nodeList.forEach((value, key, nodeList) => {
            if (this.age > value[2]) {
                key.remove();
                nodeList.delete(key);
            };
        });
    };
    generateData() {
        var it = this.processData(data);
        var res = it.next();
        id = 0;
        while (!res.done) {
            res = it.next();
        };
        if (res.done) {
            this.garbage()
            this.mode = false;
            ++this.age;
        };
    };
};

function isVisible(element){
    var elementRect = element.getBoundingClientRect();
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    if (elementRect.left + elementRect.width < 0) return false
    if (elementRect.left + elementRect.width > ww) return false
    if (elementRect.top + elementRect.height < 0) return false
    if (elementRect.top + elementRect.height > wh) return false
    return true
};

export {
    Graphics
}