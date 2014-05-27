var cpuChart = cpuChart || {};

console.log('this is my cpuChart obj', cpuChart);

document.addEventListener('DOMContentLoaded', function() {

    //OpenFin is ready.
    fin.desktop.main(function() {

        var closeButton = document.getElementById('close-app'),
            minimizeButton = document.getElementById('minimize-window'),
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

        //set up window move effects.
        utils.registerDragHandler(mainWindow);

    });
});
