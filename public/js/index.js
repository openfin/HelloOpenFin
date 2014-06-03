(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        //OpenFin is ready.
        fin.desktop.main(function() {
            //request the windows.
            var mainWindow = fin.desktop.Window.getCurrent(),
                draggableArea = document.querySelector('.container'),
                //start the cpu window in a hidded state
                cpuWindow = windowFactory.create({
                    "name": "cpuChild",
                    "url": 'views/cpu.html',
                }),
                addApplicationWindow;

            fin.desktop.System.getConfig(function(config) {
                addApplicationWindow = windowFactory.create({
                    name: 'addApplicationWindow',
                    url: 'views/addapplication.html',
                    defaultHeight: config.startup_app.defaultHeight,
                    defaultWidth: config.startup_app.defaultWidth,
                    maxWidth: config.startup_app.maxWidth,
                    maxHeight: config.startup_app.maxHeight,
                });

                //register the event handlers.
                setEventHandlers(mainWindow, cpuWindow, addApplicationWindow);
            });

            //set the drag animations.
            mainWindow.defineDraggableArea(draggableArea, function(data) {
                if (data.reason !== "self") {
                    return;
                }
                mainWindow.animate({
                    opacity: utils.transparentOpacityAnimation,
                }, {
                    interrupt: false
                });
            }, function(data) {
                mainWindow.animate({
                    opacity: utils.solidOpacityAnimation
                }, {
                    interrupt: true
                });
            }, function(err) {
                console.log(err);
            });

            //show the main window now that we are ready.
            mainWindow.show();
        });

        //set event handlers for the different buttons.
        var setEventHandlers = function(mainWindow, cpuWindow, addApplicationWindow) {
            //Buttons and components.
            var desktopNotificationButton = document.getElementById('desktop-notification'),
                cpuInfoButton = document.getElementById('cpu-info'),
                closeButton = document.getElementById('close-app'),
                arrangeWindowsButton = document.getElementById('arrange-windows'),
                minimizeButton = document.getElementById('minimize-window'),
                addApplicationButton = document.getElementById('add-app');

            //Close button event handler
            closeButton.addEventListener('click', function() {
                mainWindow.close();
            });

            //Minimize button event handler
            minimizeButton.addEventListener('click', function() {
                mainWindow.minimize();
            });

            //Desktop notification event handler
            desktopNotificationButton.addEventListener('click', function() {
                var notification = new fin.desktop.Notification({
                    url: '/views/notification.html',
                    message: 'Notification from app'
                });
            });

            //Cpu information button.
            cpuInfoButton.addEventListener('click', function() {
                cpuWindow.isShowing(function(isShowing) {
                    //if (!isShowing) {
                    showWindow(cpuWindow, [mainWindow, addApplicationWindow]);
                    //}
                });
            });

            //Add application button.
            addApplicationButton.addEventListener('click', function() {
                addApplicationWindow.isShowing(function(isShowing) {
                    //if (!isShowing) {
                    showWindow(addApplicationWindow, [mainWindow, cpuWindow]);
                    //}
                });
            });

            //Arrange windows in the desktop.
            arrangeWindowsButton.addEventListener('click', function() {
                //move them to the top left by default, if windows are there move to bottom right.
                fin.desktop.System.getMonitorInfo(function(monitorInfo) {
                    synchronizeWindowAnimation([mainWindow, cpuWindow, addApplicationWindow], monitorInfo, null);
                });
            });
        };

        var showWindow = function(windowToShow, relatedWindows) {
            fin.desktop.System.getMonitorInfo(function(monitorInfo) {
                positionWindows(windowToShow, relatedWindows, monitorInfo, null);
            });
        };

        var positionWindows = function(windowToShow, windowList, monitorInfo, previousWindowBounds) {
            var currentWindow = windowList.shift(),
                destination;
            if (previousWindowBounds) {
                destination = {
                    top: previousWindowBounds.top,
                    left: previousWindowBounds.left + previousWindowBounds.width + utils.cpuWindowMargin,
                    duration: 200
                };
                if (!currentWindow) {
                    windowToShow.animate({
                        position: destination
                    }, {
                        interrupt: true
                    });
                    windowToShow.animate({
                        position: destination
                    }, {
                        interrupt: true
                    }, function() {
                        windowToShow.show();
                    });
                    return;
                } else {
                    //arrange before we move.
                    currentWindow.animate({
                        position: destination,
                    }, {
                        interrupt: false
                    });
                }
            }
            currentWindow.isShowing(function(isShowing) {
                if (!isShowing) {
                    positionWindows(windowToShow, windowList, monitorInfo, previousWindowBounds);
                    return;
                }
                currentWindow.getBounds(function(currentWindowBounds) {
                    if (destination) {
                        currentWindowBounds.top = destination.top;
                        currentWindowBounds.left = destination.left;
                    }
                    positionWindows(windowToShow, windowList, monitorInfo, currentWindowBounds);
                });
            });

        };

        //make sure the window animation happens for all windows seamingly at the same time
        var synchronizeWindowAnimation = function(windowList, monitorInfo, previousWindowBounds) {
            var currentWindow = windowList.shift();
            if (!currentWindow) {
                return;
            }
            animateWindow(currentWindow, monitorInfo, previousWindowBounds, function(currentWindowBounds) {
                synchronizeWindowAnimation(windowList, monitorInfo, currentWindowBounds);
            });
        };

        //animates a window in relation of the other windows.
        var animateWindow = function(currentWindow, monitorInfo, previousWindowBounds, callback) {
            var destination = {
                top: 10,
                left: 10,
                duration: 1000
            };

            currentWindow.isShowing(function(isShowing) {
                if (!isShowing) {
                    //call the function with the previous window bounds instead of the current.
                    callback(previousWindowBounds);
                    return;
                }

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
                            destination.left += previousWindowBounds.width + utils.cpuWindowMargin;
                        } else {
                            destination.left -= bounds.width + utils.cpuWindowMargin;
                        }
                    }

                    //animate the main window.
                    currentWindow.animate({
                        opacity: utils.transparentOpacityAnimation,
                        position: destination
                    }, {
                        interrupt: true
                    }, function() {
                        currentWindow.animate({
                            opacity: utils.solidOpacityAnimation
                        }, {
                            interrupt: true
                        });
                    });

                    //we modify the bounds before we move so that the next window in the animation has the final destination.
                    bounds.top = destination.top;
                    bounds.left = destination.left;
                    //callback with the current windows bounds
                    callback(bounds);
                });
            });
        };
    });
}());
