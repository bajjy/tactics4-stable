var style = document.createElement('style');
style.id = 'fxCameraXray';
function appendStyle(cls) {
    style.innerHTML += `
        ${cls}.animationfxCameraXray {
            opacity: 1;
            transition: All 1s ease-out;
        }
        ${cls}.fxCameraXray {
            opacity: 0.25;
            pointer-events: none;
        }
    `;
}

function cameraXray(input, ss) {
    var cursor = input[0];
    var target = this.connected ? this.connected.asset : false;
    var settings = input[1].renderSetup.fxXRAY;

    if (!this.connected || !target) return false;

    if (!document.querySelector(`head #${style.id}`)) {
        settings.target.map(cls => appendStyle(cls));
        document.querySelector('head').appendChild(style);
    };

    cursor.querySelectorAll(settings.target).forEach((el, index) => {
        let targetBound = target.getBoundingClientRect();
        let wallBound = el.getBoundingClientRect();

        requestTimeout(() => {
            el.classList.remove('fxCameraXray');
            if (targetBound.left + 50 >= wallBound.left && targetBound.right - 50 <= wallBound.right && targetBound.bottom <= wallBound.bottom) {
                el.classList.add('animationfxCameraXray');
                requestTimeout(() => {
                    el.classList.add('fxCameraXray');
                }, index * 20)
                requestTimeout(() => {
                    el.classList.remove('animationfxCameraXray');
                }, 1000 + index * 20)
            };
        }, index * 20);
    })
};

export {
    cameraXray
}