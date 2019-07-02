var now = new Date().getTime();
var domLoadTime = now - performance.timing.navigationStart;
var speed = 'slowpoke';
var time = domLoadTime;
var brakePoints = {
    slowpoke: 5000, //max width //GPRS
    slow: 4999, //min width //2g
    regular: 1999,
    fast: 800
};

var frameRates = {
    fpsX: 1, //perfo,mance defined. 60 fps in best
    fps60: 1000 / 60, //16.66666666
    fps48: 1000 / 48, //20.8333333
    fps30: 1000 / 30, //33.3333333
    fps24: 1000 / 24, //41.6666667
    fps18: 1000 / 18, //55.5555556
    fps10: 1000 / 10, //83.3333333
    fps60f: 1000 / 59.94,
    fps48f: 1000 / 47.952,
    fps30f: 1000 / 29.97,
    fps24f: 1000 / 23.976
};

function fps(target) {
    //console.clear();
    //console.log('%cFPS: ' + countFPS(), "color: yellow; font-style: italic; background-color: blue; padding: 2px;");
    return frameRates[target] || frameRates['fpsX']
};

function checkSpeedRating() {
    for (let p in brakePoints) {
        let point = brakePoints[p];
        if (domLoadTime <= point) {
            speed = p;
        };
    }
};
checkSpeedRating();

export {
    speed,
    brakePoints,
    time,
    fps
}
