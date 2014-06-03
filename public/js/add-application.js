(function() {
    'use strict';
    var closeButton = document.getElementById('close-app'),
        minimizeButton = document.getElementById('minimize-window'),
        generateJsonButton = document.getElementById('generate-json'),
        createInstallerButton = document.getElementById('create-installer'),
        newAppForm = document.querySelector('#newAppForm'),
        generateJsonButtonVisible = true;

    document.addEventListener('DOMContentLoaded', function() {
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
        generateJsonButton.addEventListener('click', function(e) {
            generateJson(mainWindow, newAppForm, e);
        });
        createInstallerButton.addEventListener('click', function(e) {
            createInstaller(mainWindow, e);
        });
    };

    var toggleActionButtonVisibility = function() {
        if (generateJsonButtonVisible) {
            createInstallerButton.style.display = '';
            generateJsonButton.style.display = 'none';
            generateJsonButtonVisible = false;
        } else {
            generateJsonButton.style.display = '';
            createInstallerButton.style.display = 'none';
            generateJsonButtonVisible = true;
        }
    };

    var generateJson = function(mainWindow, newAppForm, event) {
        var appName,
            appUrl,
            iconUrl;

        if (!newAppForm.checkValidity()) {
            return;
        } else {
            appName = newAppForm.querySelector('#appName').value;
            appUrl = newAppForm.querySelector('#startURL').value;
            iconUrl = newAppForm.querySelector('#iconUrl').value;
        }
        //grab the current set of configuration.
        fin.desktop.System.getConfig(function(config) {
            //edit the startup app info
            config.startup_app.name = appName;
            config.startup_app.url = appUrl;
            config.startup_app.uuid = appName;
            config.startup_app.frame = true;
            config.startup_app.applicationIcon = iconUrl;
            config.startup_app.autoShow = true;

            //edit the manifest app info.
            config.manifest.description = appName;
            config.manifest.name = appName;
            config.manifest.icon = iconUrl;

            saveObjectAsJson(config, appName, appUrl, iconUrl);
            toggleActionButtonVisibility();
        });
        event.preventDefault();
    };

    var createInstaller = function(mainWindow, event) {
        //TODO:change to the actual url.
        fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/first-look.html');
        toggleActionButtonVisibility();
        event.preventDefault();
    };

    //saves an javascript object to a json file.
    var saveObjectAsJson = function(obj) {
        var downloadLink = document.createElement('a'),
            json = JSON.stringify(obj),
            dataBlob = new Blob([json], {
                type: "octet/stream"
            }),
            blobUrl = URL.createObjectURL(dataBlob);

        downloadLink.href = blobUrl;
        downloadLink.download = "start.json";
        downloadLink.click();
    };
}());
