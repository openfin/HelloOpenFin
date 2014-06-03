var cpuChart = cpuChart || {};

console.log('this is my cpuChart obj', cpuChart);

document.addEventListener('DOMContentLoaded', function() {

    //OpenFin is ready.
    fin.desktop.main(function() {

        var closeButton = document.getElementById('close-app'),
            minimizeButton = document.getElementById('minimize-window'),
            draggableArea = document.querySelector('.container'),
            mainWindow = fin.desktop.Window.getCurrent();

        /* kick off a d3 chart that displays cpu usage data */
        cpuChart.initChart();

        //Close button event handler
        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

        //Minimize button event handler
        minimizeButton.addEventListener('click', function() {
            mainWindow.minimize();
        });

        //set the drag animations.
        mainWindow.defineDraggableArea(draggableArea, function(data) {
            if (data.reason !== "self") {
                return;
            }
            mainWindow.animate({
                opacity: utils.transparentOpacityAnimation,
            }, {
                interrupt: false
            });
        }, function(data) {
            mainWindow.animate({
                opacity: utils.solidOpacityAnimation
            }, {
                interrupt: true
            });
        }, function(err) {
            console.log(err);
        });

    });
});
