(function() {
    'use strict';
    var mainWindow,
        draggableArea,
        //start the cpu window in a hidded state
        cpuWindow,
        addApplicationWindow,
        aboutWindow;
    document.addEventListener('DOMContentLoaded', function() {
        //OpenFin is ready.
        fin.desktop.main(function() {
            //request the windows.
            mainWindow = fin.desktop.Window.getCurrent();
            draggableArea = document.querySelector('.container');
            //start the cpu window in a hidded state
            cpuWindow = windowFactory.create({
                "name": "cpuChild",
                "url": 'views/cpu.html',
            });

            fin.desktop.System.getConfig(function(config) {
                addApplicationWindow = windowFactory.create({
                    name: 'addApplicationWindow',
                    url: 'views/addapplication.html',
                    defaultHeight: config.startup_app.defaultHeight,
                    defaultWidth: config.startup_app.defaultWidth,
                    maxWidth: config.startup_app.maxWidth,
                    maxHeight: config.startup_app.maxHeight,
                });

                aboutWindow = windowFactory.create({
                    name: 'aboutWindow',
                    url: 'views/about.html',
                    defaultHeight: config.startup_app.defaultHeight,
                    defaultWidth: config.startup_app.defaultWidth,
                    maxWidth: config.startup_app.maxWidth,
                    maxHeight: config.startup_app.maxHeight
                }, function() {
                    animations.showWindow(aboutWindow, [mainWindow, addApplicationWindow, cpuWindow]);
                });
                //register the event handlers.
                setEventHandlers();
            });

            //set the drag animations.
            animations.defineDraggableArea(mainWindow, draggableArea);

            //show the main window now that we are ready.
            mainWindow.show();
        });
    });

    //set event handlers for the different buttons.
    var setEventHandlers = function() {
        //Buttons and components.
        var desktopNotificationButton = document.getElementById('desktop-notification'),
            cpuInfoButton = document.getElementById('cpu-info'),
            closeButton = document.getElementById('close-app'),
            arrangeWindowsButton = document.getElementById('arrange-windows'),
            minimizeButton = document.getElementById('minimize-window'),
            addApplicationButton = document.getElementById('add-app'),
            aboutButton = document.getElementById('about-app');

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
            animations.showWindow(cpuWindow, [mainWindow, addApplicationWindow, aboutWindow]);
        });

        //Add application button.
        addApplicationButton.addEventListener('click', function() {
            animations.showWindow(addApplicationWindow, [mainWindow, cpuWindow, aboutWindow]);
        });

        aboutButton.addEventListener('click', function() {
            animations.showWindow(aboutWindow, [mainWindow, addApplicationWindow, cpuWindow]);
        });

        //Arrange windows in the desktop.
        arrangeWindowsButton.addEventListener('click', function() {
            animations.animateWindows([mainWindow, cpuWindow, addApplicationWindow, aboutWindow]);
        });
    };
}());
