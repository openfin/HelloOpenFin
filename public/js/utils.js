var utils = utils || {};
(function() {
    'use strict';

    var transitionDuration = 300,
        transparentOpacityVal = 0.7;

    //transparency animation used.
    utils.transparentOpacityAnimation = {
        opacity: transparentOpacityVal,
        //time in ms
        duration: transitionDuration
    };

    //solid animation options used.
    utils.solidOpacityAnimation = {
        opacity: 1,
        //time in ms.
        duration: transitionDuration
    };

    //will make an object dragable.
    utils.registerDragHandler = function registerDragHandler(mainWindow) {

        var boundsChanging = false;

        mainWindow.addEventListener("bounds-changing", function() {
            if (!boundsChanging) {
                //animate the main window.
                mainWindow.animate({
                    opacity: utils.transparentOpacityAnimation,
                }, {
                    interrupt: false
                });
                boundsChanging = true;
            }
        });

        mainWindow.addEventListener("bounds-changed", function() {
            mainWindow.animate({
                opacity: utils.solidOpacityAnimation
            }, {
                interrupt: false
            });

            boundsChanging = false;
        });

    };
}());
