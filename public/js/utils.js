var utils = utils || {};
(function() {
    'use strict';

    var transitionDuration = 200,
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
        var mouseDown = false,
            mouseMoved = false,
            threshold = 3,
            offset = {},
            ofDraggable = document.querySelectorAll('.of-draggable')[0],
            isFunction = function(val) {
                return typeof val === 'function';
            },
            noop = function() {};

        //obtain the initial mouse position and initiate the tracking.
        ofDraggable.addEventListener('mousedown', function(e) {
            mouseDown = true;
            offset.x = e.x;
            offset.y = e.y;
        });

        //obtain the mouse position via the OpenFin API and execute the callbacks.
        ofDraggable.addEventListener('mousemove', function(e) {
            if (mouseDown) {
                //is the movement within the threshold ?
                if (!mouseMoved && Math.sqrt(Math.pow((e.x - offset.x), 2) + Math.pow((e.y - offset.y), 2)) >= threshold) {
                    mouseMoved = true;

                    //animate effect.
                    mainWindow.animate({
                        opacity: utils.transparentOpacityAnimation
                    });
                }

                //get the mouse position via the api for all subsequent move events.
                if (mouseMoved) {
                    fin.desktop.System.getMousePosition(function(data) {
                        mainWindow.moveTo(data.left - offset.x, data.top - offset.y);
                    });
                }
            }
        });

        //if movement was being tracked call the end.
        ofDraggable.addEventListener('mouseup', function(e) {
            if (mouseMoved && e.button === 0) {
                mainWindow.animate({
                    opacity: utils.solidOpacityAnimation
                });
            }

            mouseDown = false;
            mouseMoved = false;
        });
    };
}());
