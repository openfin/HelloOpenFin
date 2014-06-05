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
            animations.defineDraggableArea(mainWindow, draggableArea);

            //show the main window now that we are ready.
            mainWindow.show();
        });
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
            animations.showWindow(cpuWindow, [mainWindow, addApplicationWindow]);
        });

        //Add application button.
        addApplicationButton.addEventListener('click', function() {
            animations.showWindow(addApplicationWindow, [mainWindow, cpuWindow]);
        });

        //Arrange windows in the desktop.
        arrangeWindowsButton.addEventListener('click', function() {
            animations.animateWindows([mainWindow, cpuWindow, addApplicationWindow]);
        });
    };
}());
