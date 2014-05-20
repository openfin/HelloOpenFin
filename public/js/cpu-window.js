var cpuChart = cpuChart || {};

console.log('this is my cpuChart obj', cpuChart);

document.addEventListener('DOMContentLoaded', function() {
    fin.desktop.main(function() {

        var ofDraggable = document.querySelectorAll('.of-draggable')[0],
            closeButton = document.querySelectorAll('#close-app')[0],

            mainWindow = fin.desktop.Window.getCurrent();

        /* kick off a d3 chart that displays cpu usage data */
        cpuChart.initChart();

        //Close button event handler
        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

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
