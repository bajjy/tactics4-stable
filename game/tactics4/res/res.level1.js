import * as fetchmodel from '../lib.fetchmodel.js';

var resList = [
    'scenario',
    'smoke_003_up',
    'liquid_029_splash',
    'small',
    'fighter',
    'rectangle',
    'sceneGorge0',
    'sceneGorge1',
    'dwelling',
    'transfer',
    'sceneStartScreen',
    'swamp',
    'water',
    'platform',
    'fort',
    'brute',
    'shooter',
    'witch',
    'sceneEndScreen',
    'sceneErrorScreen'
];

function resources() {
    return Promise.all(
            [
                fetch('/scenario/scenario.gorge.json').then(data => data.json()),
                fetchmodel.getImage('/images/smoke_003_up.png'),
                fetchmodel.getImage('/images/liquid_029_splash.png'),
                fetchmodel.getModel('/models/small.html'),
                fetchmodel.getModel('/models/fighter1.html'),
                fetchmodel.getModel('/models/rectangle-long.html'),
                fetchmodel.getModel('/models/scene-gorge-0.html'),
                fetchmodel.getModel('/models/scene-gorge-1.html'),
                fetchmodel.getModel('/models/cave1.html'),
                fetchmodel.getModel('/models/archway1.html'),
                fetchmodel.getModel('/models/scene-start-screen.html'),
                fetchmodel.getModel('/models/swamp1.html'),
                fetchmodel.getModel('/models/water1.html'),
                fetchmodel.getModel('/models/platform1.html'),
                fetchmodel.getModel('/models/fort1.html'),
                fetchmodel.getModel('/models/brute1.html'),
                fetchmodel.getModel('/models/shooter1.html'),
                fetchmodel.getModel('/models/witch1.html'),
                fetchmodel.getModel('/models/scene-end-screen.html'),
                fetchmodel.getModel('/models/scene-error-screen.html')
            ].map(item => {
                return item.then(data => data)
            })
        )
        .then(data => {
            var dataList = {}

            resList.reduce(function(result, item, index, array) {
                result[item] = data[index];
                return result;
            }, dataList);

            return dataList;
        })
};

export {
    resources
}