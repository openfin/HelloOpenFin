var cpuChart = cpuChart || {};

document.addEventListener('DOMContentLoaded', function() {

    //OpenFin is ready.
    fin.desktop.main(function() {

        var closeButton = document.getElementById('close-app'),
            minimizeButton = document.getElementById('minimize-window'),
            draggableArea = document.querySelector('.container'),
            mainWindow = fin.desktop.Window.getCurrent(),
            runtimeVersionNumberContainer = document.querySelector('#runtime-version-number');

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

        fin.desktop.System.getVersion(function(version) {
            runtimeVersionNumberContainer.innerText = version;
        });

        //set the drag animations.
        animations.defineDraggableArea(mainWindow, draggableArea);
    });
});
