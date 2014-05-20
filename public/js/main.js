(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {

        //get the
        var desktopNotificationButton = document.querySelectorAll('#desktop-notification')[0],
            cpuInfoButton = document.querySelectorAll('#cpu-info')[0],
            closeButton = document.querySelectorAll('#close-app')[0],
            ofDraggable = document.querySelectorAll('.of-draggable')[0];

        //OpenFin is ready.
        fin.desktop.main(function() {

            //the OpenFin main window.
            var mainWindow = fin.desktop.Window.getCurrent();

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
                fin.desktop.System.showDeveloperTools();
                cpu.open();
            });

            //set up window move.
            utils.registerDragHandler(ofDraggable, {
                //once movement starts make the window transparent.
                onDragStart: function(x, y) {
                    mainWindow.updateOptions({
                        opacity: 0.5
                    });
                },
                //move the window with the mouse
                onDrag: function(X, Y) {
                    window.moveTo(X, Y);
                },
                //window can now stop being transparent.
                onDragEnd: function() {
                    mainWindow.updateOptions({
                        opacity: 1
                    });
                }
            });
        });
    });
}());
