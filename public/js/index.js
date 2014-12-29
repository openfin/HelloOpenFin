(function() {
    'use strict';
    var mainWindow,
        draggableArea,
        //start the cpu window in a hidded state
        cpuWindow,
        addApplicationWindow,
        flipContainer,
        githubLink,
        openFinApiLink,
        appGalleryLink,
        defaultWindowConfig = {
            defaultHeight: 525,
            defaultWidth: 395,
            maxWidth: 395,
            maxHeight: 525,
        };
    document.addEventListener('DOMContentLoaded', function() {
        //OpenFin is ready
        fin.desktop.main(function() {
            //request the windows.
            mainWindow = fin.desktop.Window.getCurrent();
            draggableArea = document.querySelector('.container');
            //start the cpu window in a hidded state
            cpuWindow = windowFactory.create({
                "name": "cpuChild",
                "url": 'views/cpu.html',
            });

            addApplicationWindow = windowFactory.create(utils.extend(defaultWindowConfig, {
                name: 'addApplicationWindow',
                url: 'views/addapplication.html'
            }));
            //register the event handlers.
            setEventHandlers();

            //set the drag animations.
            animations.defineDraggableArea(mainWindow, draggableArea);

            //show the main window now that we are ready.
            mainWindow.show();
        });

    });

    var flipDisplay = function() {
        flipContainer.classList.toggle("flip");
    };
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
        flipContainer = document.querySelector('.two-sided-container');
        githubLink = document.getElementById('githubLink');
        openFinApiLink = document.getElementById('openFinApiLink');
        appGalleryLink = document.getElementById('appGalleryLink');

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
                url: 'views/notification.html',
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

        aboutButton.addEventListener('click', function() {
            flipDisplay();
        });

        //Arrange windows in the desktop.
        arrangeWindowsButton.addEventListener('click', function() {
            animations.animateWindows([mainWindow, cpuWindow, addApplicationWindow]);
        });

        //github link event handler
        githubLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('https://github.com/openfin/HelloOpenFin');
        });

        //OpenFin api link event handler
        openFinApiLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/first-look.html');
        });

        //OpenFin App Gallery link event handler
        appGalleryLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('http://openfin.co/app-gallery.html');
        });
    };
}());
