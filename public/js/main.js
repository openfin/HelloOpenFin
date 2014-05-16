(function() {
    document.addEventListener('DOMContentLoaded', function() {

        var newWindowButton = document.querySelectorAll('#new-window')[0],
            desktopNotificationButton = document.querySelectorAll('#desktop-notification')[0],
            cpuInfoButton = document.querySelectorAll('#cpu-info')[0];

        console.log('Hello world');

        //set the event listeners.
        newWindowButton.addEventListener('click', function() {
            console.log('new window click');
        });
        desktopNotificationButton.addEventListener('click', function() {
            console.log('desktop notification click');
        });
        cpuInfoButton.addEventListener('click', function() {
            console.log('cpu info click');
        });
    });
}());
