(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {

        var desktopNotificationButton = document.querySelectorAll('#desktop-notification')[0],
            cpuInfoButton = document.querySelectorAll('#cpu-info')[0],
            closeButton = document.querySelectorAll('#close-app')[0],
            ofDraggable = document.querySelectorAll('.of-draggable')[0],
            arrangeWindowsButton = document.querySelectorAll('#arrange-windows')[0];

        //OpenFin is ready.
        fin.desktop.main(function() {

            //the OpenFin main window.
            var mainWindow = fin.desktop.Window.getCurrent(),
                transparentOpacityAnimation = {
                    opacity: 0.15,
                    duration: 500
                },
                solidOpacityAnimation = {
                    opacity: 1,
                    duration: 500
                },
                cpuWindow,
                monitorInfo;

            var arrangeWindows = function(destination, mainWindowBounds) {
                mainWindow.animate({
                        opacity: transparentOpacityAnimation,
                        position: destination
                    }, {
                        interrupt: false
                    },

                    function(evt) {
                        mainWindow.animate({
                            opacity: solidOpacityAnimation
                        });
                    });

                if (cpuWindow) {
                    cpuWindow.getBounds(function(bounds) {
                        if (destination.left < mainWindowBounds.width) {
                            destination.left += mainWindowBounds.width;
                        } else {
                            destination.left -= bounds.width;
                        }
                        cpuWindow.animate({
                            opacity: transparentOpacityAnimation,
                            position: destination
                        }, {
                            interrupt: false
                        }, function(evt) {
                            cpuWindow.animate({
                                opacity: solidOpacityAnimation
                            });
                        });
                    });
                }
            };

            //set the monitor information.
            fin.desktop.System.getMonitorInfo(function(info) {
                monitorInfo = info;
            });
            //show the main window now that we are ready.
            mainWindow.show();

            //Close button event handler
            closeButton.addEventListener('click', function() {
                mainWindow.close();
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
                mainWindow.getBounds(function(bounds) {
                    var showCpu = function() {
                        cpuWindow.moveTo(bounds.left + bounds.width, bounds.top);
                        cpuWindow.show();
                    };
                    if (cpuWindow) {
                        showCpu();
                    } else {
                        cpuWindow = cpu.open(showCpu);
                    }
                });

            });

            //Arrange windows in the desktop.
            arrangeWindowsButton.addEventListener('click', function() {
                //move them to the top left by default, if windows are there move to bottom right.
                mainWindow.getBounds(function(bounds) {
                    var destination = {
                        top: 0,
                        left: 0,
                        duration: 1000
                    };
                    if (bounds.top === destination.top && bounds.left === destination.left) {
                        destination.top = monitorInfo.primaryMonitor.availableRect.bottom - bounds.height;
                        destination.left = monitorInfo.primaryMonitor.availableRect.right - bounds.width;
                    }
                    arrangeWindows(destination, bounds);
                });
            });

            //set up window move.
            utils.registerDragHandler(ofDraggable, {
                //once movement starts make the window transparent.
                onDragStart: function(x, y) {
                    mainWindow.animate({
                        opacity: transparentOpacityAnimation
                    });
                },
                //move the window with the mouse
                onDrag: function(X, Y) {
                    mainWindow.moveTo(X, Y);
                },
                //window can now stop being transparent.
                onDragEnd: function() {
                    mainWindow.animate({
                        opacity: solidOpacityAnimation
                    });
                }
            });

        });
    });
}());
