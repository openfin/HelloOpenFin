(function() {
    'use strict';
    //get a hold of the elements we will interact with.
    var closeButton = document.querySelector('#close-app'),
        minimizeButton = document.querySelector('#minimize-window'),
        switchToMessageFormButton = document.querySelector('#switch-to-message-form'),
        backButton = document.querySelector('#back-button'),
        flipContainer = document.querySelector('.two-sided-container'),
        sendMessageButton = document.querySelector('#send-message');

    document.addEventListener('DOMContentLoaded', function() {
        //OpenFin is ready
        fin.desktop.main(function() {
            //request the window
            var mainWindow = fin.desktop.Window.getCurrent(),
                draggableArea = document.querySelector('.container');

            //set event emiters.
            setEventEmmiters(mainWindow);

            //set the drag animations.
            animations.defineDraggableArea(mainWindow, draggableArea);
        });
    });

    //set event handlers for the different buttons.
    var setEventEmmiters = function(mainWindow) {
        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

        minimizeButton.addEventListener('click', function() {
            mainWindow.minimize();
        });
        switchToMessageFormButton.addEventListener('click', function(e) {
            flipDisplay();
        });
        backButton.addEventListener('click', function(e) {
            flipDisplay();
        });

        sendMessageButton.addEventListener('click', function(e) {
            var topic = newAppForm.querySelector('#topic').value || "hello:of:notification",
                message = newAppForm.querySelector('#message').value || "Hello World!";

            fin.desktop.InterApplicationBus.publish(topic, {
                message: message,
                timeStamp: Date.now()
            });
        });
    };

    var flipDisplay = function() {
        flipContainer.classList.toggle("flip");
    };

}());
