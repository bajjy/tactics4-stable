function preload(text) {
    var images = new Set();
    var style = '' + text;
    var re = new RegExp(/\b(?:url\s*([^;>]*?)(?=[;]))/); ///\b(?:background-image\s*?:\s*([^;>]*?)(?=[;]))/g

    while (re.test(style)) {
        style.replace(re, (match, str, pos) => {
            images.add( str.replace('(', '').replace(')', '') );
            style = style.replace(match, 'none');
        });
    };

    for (let item of images) {
        var img = new Image();
        img.src = item;
    };
};

function modelize(html) {
    let frag = document.createElement('div');
    let style;
    frag.innerHTML = html;
    style = frag.querySelector('style');
    if (style && !document.getElementById(style.id)) document.querySelector('head').appendChild(frag.querySelector('style'));
    return frag.querySelector('div[data-model="model"]');
};

async function getModel(url) {
    var data = await (await (fetch(url)
        .then(res => {
            return res.text();
        })
        .then(text => {
            preload(text);
            return text
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    ))
    return data
};
async function getImage(url) {
    var data = await (await (fetch(url)
        .then(res => {
            return res.blob();
        })
        .then(images => {
            let url = URL.createObjectURL(images);
            return url
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    ))
    return data
};
async function getSound(url) {
    var data = await (await (fetch(url)
        .then(res => {
            return res.blob();
        })
        .then(sound => {
            let url = URL.createObjectURL(sound);
            return url
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    ))
    return data
};
async function getImageBase64(url) {
    var img = document.createElement('img');
    var data = await (await (fetch(url)
        .then(res => {
            return res.arrayBuffer();
        })
        .then(buffer => {
            var base64Flag = 'data:image/jpeg;base64,';
            var imageStr = () => {
                var binary = '';
                var bytes = [].slice.call(new Uint8Array(buffer));
                bytes.forEach((b) => binary += String.fromCharCode(b));
                return window.btoa(binary);
            };
            img.src = base64Flag + imageStr();
            return img
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    ))
    return data
};

export {
    modelize,
    getModel,
    getImageBase64,
    getImage,
    getSound
}