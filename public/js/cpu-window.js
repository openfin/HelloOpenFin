var cpuChart = cpuChart || {};

console.log('this is my cpuChart obj', cpuChart);

document.addEventListener('DOMContentLoaded', function() {

    //OpenFin is ready.
    fin.desktop.main(function() {

        var closeButton = document.querySelectorAll('#close-app')[0],
            mainWindow = fin.desktop.Window.getCurrent();

        /* kick off a d3 chart that displays cpu usage data */
        cpuChart.initChart();

        //Close button event handler
        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

        //set up window move effects.
        utils.registerDragHandler(mainWindow);

    });
});
