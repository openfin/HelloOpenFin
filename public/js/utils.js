(function() {
    'use strict';
    var utils = {};
    //will make an object dragable.
    utils.registerDragHandler = function registerDragHandler(dragableElement, options) {
        var mouseDown = false,
            mouseMoved = false,
            offset = {},
            isFunction = function(val) {
                return typeof val === 'function';
            },
            noop = function() {};

        options.threshold = options.threshold || 3;
        options.onDrag = options.onDrag || noop;
        options.onDragStart = options.onDragStart || noop;
        options.onDragEnd = options.onDragEnd || noop;

        //obtain the initial mouse position and initiate the tracking.
        dragableElement.addEventListener('mousedown', function(e) {
            mouseDown = true;
            offset.x = e.x;
            offset.y = e.y;
        });

        //obtain the mouse position via the OpenFin API and execute the callbacks.
        dragableElement.addEventListener('mousemove', function(e) {
            if (mouseDown) {
                //is the movement within the threshold ?
                if (!mouseMoved && Math.sqrt(Math.pow((e.x - offset.x), 2) + Math.pow((e.y - offset.y), 2)) >= options.threshold) {
                    mouseMoved = true;
                    fin.desktop.System.getMousePosition(function(data) {
                        options.onDragStart(data.left - offset.x, data.top - offset.y);
                    });
                }

                //get the mouse position via the api for all subsequent move events.
                if (mouseMoved) {
                    fin.desktop.System.getMousePosition(function(data) {
                        options.onDrag(data.left - offset.x, data.top - offset.y);
                    });
                }
            }
        });

        //if movement was being tracked call the end.
        dragableElement.addEventListener('mouseup', function(e) {
            if (mouseMoved && e.button === 0) {
                fin.desktop.System.getMousePosition(function(data) {
                    options.onDragEnd(data.left - offset.x, data.top - offset.y);
                });
            }

            mouseDown = false;
            mouseMoved = false;
        });
    };

    //set utils as a global variabe.
    window.utils = utils;
}());
