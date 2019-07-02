import { animationAvailable } from '../config.animationAvailable.js';
import { graphicsGlobalSettings } from '../config.graphicsGlobalSettings.js';

function setupCam(input) {
    let camera = input.view.getRender().scene.sihdre.data;
    let bg = input.view.getRender().scene.map.bg.sihdre.data;
    let hudActions = input.view.getRender().hudActions.sihdre.data;
    let hudActionsY = camera.size.height - graphicsGlobalSettings.hudActions.height;
    let hudActionsX = camera.size.width - graphicsGlobalSettings.hudActions.width;

    camera.axis.x.angle = graphicsGlobalSettings.startCamera.x.angle;
    camera.axis.z.angle = graphicsGlobalSettings.startCamera.z.angle;
    camera.axis.y.angle = 0;
    camera.axis.z.translate = graphicsGlobalSettings.startCamera.z.translate;
    camera.axis.x.translate = graphicsGlobalSettings.startCamera.x.translate;
    camera.axis.y.translate = graphicsGlobalSettings.startCamera.y.translate;

    bg.axis.x.angle = 0;
    bg.axis.z.angle = 0;
    bg.axis.y.angle = 0;
    bg.axis.z.translate = 0;

    if (hudActionsX > graphicsGlobalSettings.medias.hd) hudActionsX = graphicsGlobalSettings.medias.hd - graphicsGlobalSettings.hudActions.width;
    hudActions.axis.y.translate = hudActionsY;
    hudActions.axis.x.translate = hudActionsX;

    animationAvailable.moveToPoint(input, '0,0');
};
export {
    setupCam
}