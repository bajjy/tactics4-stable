class Geometry {
    constructor() {
        this.size = {
            FOV: 1000,
            perspective: 0,
            depth: 0,
            width: 0,
            height: 0,
            scale: 1
        };
        this.axis = {
            x: {
                translate: 0,
                origin: 0,
                scale: 1,
                angle: 0
            },
            y: {
                translate: 0,
                origin: 0,
                scale: 1,
                angle: 0
            },
            z: {
                translate: 1,
                origin: 0,
                scale: 1,
                angle: 0
            }
        }
    };
};
class Camera extends Geometry {
    constructor() {
        super();
        this.viewport;
        this.connected;
    }

    setScene(scene) {
        this.viewport = scene.viewport;
        this.axis = scene.axis;
        this.size = scene.size;
    };
    connect(d) {
        this.connected = d;
    };
    connection() {
        var corrX = this.viewport.size.width / 2;
        var corrY = this.viewport.size.height / 2;
        var corrZ = 0;

        this.axis.x.translate = -(this.connected.axis.x.translate - corrX + this.connected.size.width / 2);
        this.axis.y.translate = -(this.connected.axis.y.translate - corrY + this.connected.size.height / 2);

        this.axis.x.origin = this.connected.axis.x.translate + this.connected.size.width / 2;
        this.axis.y.origin = this.connected.axis.y.translate + this.connected.size.height / 2;
        this.axis.z.origin = this.connected.axis.z.translate;
        //this.size.perspective = Math.abs(this.axis.z.origin * this.size.FOV) || this.size.FOV;
    };
    cut(input) {
        var cursor = input[0];
        cursor.style.position = 'absolute';
        cursor.style.overflow = 'hidden';
        cursor.style.width = `${this.viewport.size.width}px`;
        cursor.style.height = `${this.viewport.size.height}px`;
        cursor.style.perspective = `${this.viewport.size.depth}px`;
    };
    takeAngle(input) {
        this.axis.x.angle = -this.connected.axis.x.angle;
        this.axis.y.angle = -this.connected.axis.y.angle;
    };
};
class Scene extends Geometry {
    constructor() {
        super();
        this.asset;
        this.viewport = this;
    };
    setAsset(tpl) {
        //should be valid html element

        if (this.asset) this.asset.remove();
        this.asset = tpl;
    };
    /*
    * Rendering methods should be run with '.call' and target context
    */
    csscast(input) {
        var cursor = input[0];
        if (!cursor.style.position) cursor.style.position = 'absolute';
        if (!cursor.style.top) cursor.style.top = 0;
        if (!cursor.style.left) cursor.style.left = 0;
        if (!cursor.style.transformStyle) cursor.style.transformStyle = 'preserve-3d';

        if (this.asset) {
            if (cursor.querySelector('[data-model="model"]')) cursor.querySelector('[data-model="model"]').remove();
            cursor.appendChild(this.asset);
            //this.asset = false
        };

        cursor.style.transform = `
            translate3d(${this.axis.x.translate}px, ${this.axis.y.translate}px, ${this.axis.z.translate}px)
            scale3d(${this.size.scale}, ${this.size.scale}, ${this.size.scale})
            rotate3d(1, 0, 0, ${this.axis.x.angle}deg)
            rotate3d(0, 1, 0, ${this.axis.y.angle}deg)
            rotate3d(0, 0, 1, ${this.axis.z.angle}deg)
        `;
        //if (this.asset === false) cursor.style.fontSize = `${Math.max(this.size.width, this.size.height)}px`;
        cursor.style.width = `${this.size.width}px`;
        cursor.style.height = `${this.size.height}px`;
        cursor.style.transformOrigin = `${this.axis.x.origin}px ${this.axis.y.origin}px ${this.axis.z.origin}px`;
        cursor.style.perspectiveOrigin = `${this.axis.x.origin}px ${this.axis.y.origin}px`;
        cursor.style.perspective = `${this.size.perspective}px`; //default was 1000
    };
    model(input) {
        var cursor = input[0];
        var model = cursor.querySelector('[data-model="model"]');
        if (!model) return false;
        var w = model.dataset.styleWidth;
        var h = model.dataset.styleHeight;
        var d = model.dataset.styleDepth;
        var r = model.getBoundingClientRect();

        model.style.transform = `
            scale3d(${this.size.width / w}, ${this.size.height / h}, ${this.size.depth / d})
        `;
    };
    center() {
        this.axis.x.origin = this.size.width / 2;
        this.axis.y.origin = this.size.height / 2;
        //this.axis.z.origin = this.size.depth / 2;
    };
};

export {
    Scene,
    Camera
}
