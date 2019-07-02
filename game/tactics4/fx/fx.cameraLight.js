var style = document.createElement('style');
style.id = 'fxCameraLight';
function appendStyle(cls) {
    style.innerHTML += `
        ${cls}.animationfxCameraLight {
            box-shadow: inset 30vw 0 10vw 0 rgba(255, 255, 255, 0);
            transition: All 0.5s ease-out;
        }
        ${cls}.fxCameraLight-1 {
            box-shadow: inset 30vw 0 10vw 0 rgba(255, 255, 255, 0.100);
        }
        ${cls}.fxCameraLight-2 {
            box-shadow: inset 30vw 0 10vw 0 rgba(255, 255, 255, 0.075);
        }
        ${cls}.fxCameraLight-5 {
            box-shadow: inset 30vw 0 10vw 0 rgba(255, 255, 255, 0.050);
        }
        ${cls}.fxCameraLight-7 {
            box-shadow: inset 30vw 0 10vw 0 rgba(255, 255, 255, 0.025);
        }
    `;
}

function cameraLight(input) {
    var cursor = input[0];
    var target = this.connected ? this.connected.asset : false;
    var settings = input[1].renderSetup.fxLIGHT;

    if (!this.connected || !target) return false;

    if (!document.querySelector(`head #${style.id}`)) {
        settings.target.map(cls => appendStyle(cls));
        document.querySelector('head').appendChild(style);
    };

    cursor.querySelectorAll(settings.target).forEach((el, index) => {
        let targetBound = target.getBoundingClientRect();
        let wallBound = el.getBoundingClientRect();

        requestTimeout(() => {
            el.classList.remove('fxCameraLight-1', 'fxCameraLight-2', 'fxCameraLight-5', 'fxCameraLight-7');
            if (targetBound.left + 100 >= wallBound.left && targetBound.right - 100 <= wallBound.right && targetBound.bottom - 50 <= wallBound.bottom) {
                let deep = wallBound.bottom - targetBound.bottom;
                let cdeep = 1;
                if (deep <= -30) cdeep = 2;
                if (deep <= -10) cdeep = 5;
                if (deep <= 0) cdeep = 7;
                el.dataset.deep = deep
                el.classList.add('animationfxCameraLight');
                requestTimeout(() => {
                    el.classList.add(`fxCameraLight-${cdeep}`);
                }, 0)
                requestTimeout(() => {
                    el.classList.remove('animationfxCameraLight');
                }, 500 + index)
            };
        }, 0);
        
    })
};

export {
    cameraLight
}