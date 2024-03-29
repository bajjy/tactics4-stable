// Drop in replace functions for setTimeout() & setInterval() that 
// make use of requestAnimationFrame() for performance where available
// http://www.joelambert.co.uk

// Copyright 2011, Joe Lambert.
// Free to use under the MIT license.
// http://www.opensource.org/licenses/mit-license.php

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/

window.requestAnimFrameClear = false;

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function (fn, delay) {
    if (!window.requestAnimationFrame &&
        !window.webkitRequestAnimationFrame &&
        !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
        !window.oRequestAnimationFrame &&
        !window.msRequestAnimationFrame)
        return window.setInterval(fn, delay);

    var start = new Date().getTime();
    var handle = new Object();

    function loop() {
        var current = new Date().getTime();
        var delta = current - start;

        if (window.requestAnimFrameClear) {
            window.clearRequestInterval(handle.value);
            return false
        };
        if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
        }

        handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function (handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
        window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
        window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
        window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
        window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
        window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
        clearInterval(handle);
};

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestTimeout = function (fn, delay) {
    if (!window.requestAnimationFrame &&
        !window.webkitRequestAnimationFrame &&
        !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
        !window.oRequestAnimationFrame &&
        !window.msRequestAnimationFrame)
        return window.setTimeout(fn, delay);

    var start = new Date().getTime();
    var handle = new Object();

    function loop() {
        var current = new Date().getTime();
        var delta = current - start;

        if (window.requestAnimFrameClear) {
            window.clearRequestTimeout(handle.value);
            return false
        };
        delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function (handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
        window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
        window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
        window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
        window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
        window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
        clearTimeout(handle);
};