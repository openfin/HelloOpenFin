var animations = animations || {};
(function() {
    'use strict';
    var transitionDuration = 200,
        transparentOpacityVal = 0.7,
        transparentOpacityAnimation = {
            opacity: transparentOpacityVal,
            //time in ms
            duration: transitionDuration
        },
        solidOpacityAnimation = {
            opacity: 1,
            //time in ms.
            duration: transitionDuration
        },
        windowMargin = 10;

    //animate a window given a destination.
    var animateToDestination = function(ofinWindow, destination, useTransparency, onFinished) {
        //animate the main window.
        ofinWindow.animate({
            opacity: useTransparency ? transparentOpacityAnimation : null,
            position: destination
        }, {
            interrupt: true
        }, function() {
            ofinWindow.animate({
                opacity: solidOpacityAnimation
            }, {
                interrupt: true
            });
            onFinished();
        });
    };

    //show a window relative to other windows that might be visible.
    animations.showWindow = function(windowToShow, relatedWindows) {
        var monitorInfo,
            destination,
            bounds;

        //obtain the monitor information.
        fin.desktop.System.getMonitorInfo(function(monitor) {
            monitorInfo = monitor;
            //start the position and show loop that will move windows around and show the window.
            positionAndShowLoop();
        });

        //will go over the windows and determine the position of each before showing the requested window.
        var positionAndShowLoop = function(previousWindowBounds) {
            var currentWindow = relatedWindows.shift();

            //if its not the first related window.
            if (previousWindowBounds) {
                destination = {
                    top: previousWindowBounds.top,
                    left: previousWindowBounds.left + previousWindowBounds.width + windowMargin,
                    duration: 200
                };

                //end of the line, move the window, show it and end the loop.
                if (!currentWindow) {
                    animateToDestination(windowToShow, destination, false, function() {
                        windowToShow.show();
                    });
                    return;
                } else {
                    //arrange before we move.
                    animateToDestination(currentWindow, destination, false, function() {});
                }
            }
            currentWindow.isShowing(function(isShowing) {
                currentWindow.getBounds(function(currentWindowBounds) {
                    if (!isShowing) {
                        bounds = previousWindowBounds;
                    } else {
                        if (destination) {
                            currentWindowBounds.top = destination.top;
                            currentWindowBounds.left = destination.left;
                        }
                        bounds = currentWindowBounds;
                    }
                    positionAndShowLoop(bounds);
                });
            });
        };
    };

    //handles the animation effect for the Animate button.
    animations.animateWindows = function(windowList) {
        var monitorInfo,
            destination = {
                top: 10,
                left: 10,
                duration: 1000
            };
        //obtain the monitor information.
        fin.desktop.System.getMonitorInfo(function(monitor) {
            monitorInfo = monitor;
            animateWindowLoop();
        });
        var animateWindowLoop = function(previousWindowBounds) {
            var currentWindow = windowList.shift();
            if (!currentWindow) {
                return;
            }
            currentWindow.isShowing(function(isShowing) {
                if (!isShowing) {
                    //call the function with the previous window bounds instead of the current.
                    animateWindowLoop(previousWindowBounds);
                } else {
                    //the current window is showing so we will take it into consideration.
                    currentWindow.getBounds(function(bounds) {
                        //first winow.
                        if (!previousWindowBounds) {
                            //check the position and adjust the mainWindowDestination.
                            if (bounds.top === destination.top && bounds.left === destination.left) {
                                destination.top = monitorInfo.primaryMonitor.availableRect.bottom - bounds.height;
                                destination.left = monitorInfo.primaryMonitor.availableRect.right - bounds.width;
                            }
                        } else {
                            //destination baseline is the previous window.
                            destination.top = previousWindowBounds.top;
                            destination.left = previousWindowBounds.left;

                            if (previousWindowBounds.left < previousWindowBounds.width) {
                                destination.left += previousWindowBounds.width + windowMargin;
                            } else {
                                destination.left -= bounds.width + windowMargin;
                            }
                        }

                        //animate the main window.
                        animateToDestination(currentWindow, destination, true, function() {});

                        //callback with the current windows bounds
                        animateWindowLoop(bounds);
                    });
                }
            });
        };
    };
    //defines a draggable area for a given openfin window.
    animations.defineDraggableArea = function(ofinWindow, draggableArea) {
        ofinWindow.defineDraggableArea(draggableArea, function(data) {
            if (data.reason !== "self") {
                return;
            }
            ofinWindow.animate({
                opacity: transparentOpacityAnimation,
            }, {
                interrupt: false
            });
        }, function(data) {
            ofinWindow.animate({
                opacity: solidOpacityAnimation
            }, {
                interrupt: true
            });
        }, function(err) {
            console.log(err);
        });
    };
}());
