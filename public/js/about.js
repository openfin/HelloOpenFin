(function() {
    'use strict';
    var closeButton,
        minimizeButton,
        mainWindow;

    document.addEventListener('DOMContentLoaded', function() {
        closeButton = document.getElementById('close-app');
        minimizeButton = document.getElementById('minimize-window');

        fin.desktop.main(function() {
            mainWindow = fin.desktop.Window.getCurrent();
        });

    });

    setEventHandlers = function() {
        //Close button event handler
        closeButton.addEventListener('click', function() {
            mainWindow.close();
        });

        //Minimize button event handler
        minimizeButton.addEventListener('click', function() {
            mainWindow.minimize();
        });
    };
}());
