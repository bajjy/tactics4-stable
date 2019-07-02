var animationGlobalSettings = {
    startScreenCam: {
        speed: 30000,
        camera: {
            axis: {
                x: {
                    angle: 30,
                    translate: 0
                },
                y: {
                    angle: 0,
                    translate: 0
                },
                z: {
                    angle: 0,
                    translate: 0
                }
            }
        },
        bg: {
            axis: {
                z: {
                    translate: 0
                }
            }
        }
    },
    endStartScreen: {
        speed: 1000
    },
    endScreenCam: {
        speed: 30000,
        camera: {
            axis: {
                x: {
                    angle: 80,
                    translate: 0
                },
                y: {
                    angle: 0,
                    translate: 400
                },
                z: {
                    angle: 0,
                    translate: 300
                }
            }
        },
        bg: {
            axis: {
                z: {
                    translate: 0
                }
            }
        }
    },
    movement: {
        speed: 300,
        CamTranslateXCorr: 600,
        CamTranslateYCorr: 40,
        axis: {
            x: {
                angle: 60
            },
            z: {
                angle: -120,
                translate: 600
            }
        }
    },
    zoomToPoint: {
        speed: 300,
        CamTranslateXCorr: 600,
        CamTranslateYCorr: 40,
        axis: {
            x: {
                angle: 60
            },
            z: {
                angle: -120,
                translate: 600
            }
        }
    },
    moveToPoint: {
        speed: 300,
        CamTranslateXCorr: 600,
        CamTranslateYCorr: 40,
        axis: {
            x: {
                angle: 60
            },
            z: {
                angle: -120,
                translate: 600
            }
        }
    },
    transfer: {
        steps: 3,
        speed: 300,
        modelCorrectionXtranslate: 100,
        modelCorrectionYtranslate: -100,
        camTranslateZstep: 350,
        camTranslateXstep: 50,
        camTranslateYstep: 25,
        camAngleZrestore: -120,
        camAngleXrestore: 60,
        axis: {
            x: {
                //angle: 60,
            },
            y: {
                //translate: 0
            },
            z: {
                //angle: -100,
            }
        }
    },
    dwelling: {
        speed: 300,
        axis: {
            x: {
                angle: 60
            },
            z: {
                angle: -120,
                translate: 600
            }
        }
    },
    thrust: {
        speed: 300
    },
    unconscious: {
        speed: 300,
        angle: 60
    },
    resurrect: {
        speed: 300
    },
    death: {
        speed: 2000
    },
    empty: {
        speed: 300
    },
    animationMoveCamera: {
        speed: 300
    }
};
// var mobile = {
//     movement: {
//         speed: 250,
//         CamTranslateXCorr: 800,
//         CamTranslateYCorr: 40,
//         axis: {
//             x: {
//                 angle: 50
//             },
//             z: {
//                 angle: -120,
//                 translate: 800
//             }
//         }
//     },
//     zoomToPoint: {
//         speed: 300,
//         CamTranslateXCorr: 800,
//         CamTranslateYCorr: 40,
//         axis: {
//             x: {
//                 angle: 50
//             },
//             z: {
//                 angle: -120,
//                 translate: 800
//             }
//         }
//     },
//     transfer: {
//         steps: 3,
//         speed: 300,
//         modelCorrectionXtranslate: 100,
//         modelCorrectionYtranslate: -100,
//         camTranslateZstep: 350,
//         camTranslateXstep: 50,
//         camTranslateYstep: 25,
//         camAngleZrestore: -120,
//         camAngleXrestore: 50,
//         axis: {
//             x: {
//                 //angle: 60,
//             },
//             z: {
//                 //angle: -100,
//             }
//         }
//     },
//     dwelling: {
//         speed: 150,
//         axis: {
//             x: {
//                 angle: 50
//             },
//             z: {
//                 angle: -120,
//                 translate: 800
//             }
//         }
//     },
//     thrust: {
//         speed: 150
//     },
//     unconscious: {
//         speed: 150,
//         angle: 50
//     },
//     death: {
//         speed: 1000
//     },
//     empty: {
//         speed: 300
//     }
// };
//if (document.documentElement.clientWidth < 1200) animationGlobalSettings = mobile;
export {
    animationGlobalSettings
}