(function() {
    'use strict';
    var closeButton,
        minimizeButton,
        draggableArea,
        githubLink,
        openFinApiLink,
        appGalleryLink;

    document.addEventListener('DOMContentLoaded', function() {
        closeButton = document.getElementById('close-app');
        minimizeButton = document.getElementById('minimize-window');
        draggableArea = document.querySelector('.container');
        githubLink = document.getElementById('githubLink');
        openFinApiLink = document.getElementById('openFinApiLink');
        appGalleryLink = document.getElementById('appGalleryLink');

        fin.desktop.main(function() {
            var mainWindow = fin.desktop.Window.getCurrent();

            setEventHandlers(mainWindow);

            //set the drag animations.
            animations.defineDraggableArea(mainWindow, draggableArea);
        });
    });

    var setEventHandlers = function(mainWindow) {
        //Close button event handler
        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

        //Minimize button event handler
        minimizeButton.addEventListener('click', function() {
            mainWindow.minimize();
        });

        githubLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('https://github.com/openfin/HelloOpenFin');
        });

        openFinApiLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/first-look.html');
        });

        appGalleryLink.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('http://openfin.co/app-gallery.html');
        });
    };
}());
