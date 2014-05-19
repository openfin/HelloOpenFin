var cpu = cpu || {};

var fin = fin || {};

console.log('this is the fin', fin);
//(function(cpu) {


        // fin.desktop.main(function () {

        //     var newWindowButton = document.querySelectorAll('#new-window')[0],
        //         desktopNotificationButton = document.querySelectorAll('#desktop-notification')[0],
        //         cpuInfoButton = document.querySelectorAll('#cpu-info')[0];

        //     console.log('Hello world');

        //     //set the event listeners.
        //     newWindowButton.addEventListener('click', function() {
        //         console.log('new window click');
        //     });
        //     desktopNotificationButton.addEventListener('click', function() {
        //         console.log('desktop notification click');
        //     });
        //     cpuInfoButton.addEventListener('click', function() {
        //         console.log('cpu info click');
        //         var cpwWnd = cpu.open();
        //         console.log(cpwWnd);
        //     });

        // });



    document.addEventListener('DOMContentLoaded', function() {
        fin.desktop.main(function () {

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
                cpu.open();
                //console.log(cpwWnd);
            });

        });


    });

//}(cpu));
