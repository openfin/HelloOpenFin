(function() {
    'use strict';
    var closeButton = document.getElementById('close-app'),
        minimizeButton = document.getElementById('minimize-window'),
        generateApplicationJsonButton = document.getElementById('generate-application-json'),
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
        generateApplicationJsonButton.addEventListener('click', function(e) {
            generateApplicationJson(mainWindow, newAppForm, e);
        });
        createInstallerButton.addEventListener('click', function(e) {
            createInstaller(mainWindow, e);
        });
    };

    var toggleActionButtonVisibility = function() {
        if (generateApplicationJsonButton.style.display === '') {
            generateApplicationJsonButton.style.display = 'none';
            createInstallerButton.style.display = '';
        } else {
            createInstallerButton.style.display = 'none';
            generateApplicationJsonButton.style.display = '';
        }
    };

    var generateStartJsonObject = function(appName, url, config) {
        return {
            env: config.env,
            desktop_core_url: config.desktop_core_url,
            desktop_controller_url: config.desktop_controller_url,
            default_icon: config.default_icon,
            startup_app: {
                name: appName,
                url: url,
                uuid: appName,
                applicationIcon: config.startup_app.applicationIcon,
            },
            runtime: {
                arguments: "",
                version: config.runtime.version
            },
            shortcut: {
                company: appName,
                description: appName,
                icon: config.shortcut.icon,
                name: appName
            }
        };
    };

    var generateApplicationJson = function(mainWindow, newAppForm, event) {
        var appName,
            appUrl;
        if (!newAppForm.checkValidity()) {
            return;
        } else {
            appName = newAppForm.querySelector('#appName').value;
            appUrl = newAppForm.querySelector('#startURL').value;
        }
        //grab the current set of configuration.
        fin.desktop.System.getConfig(function(config) {

            var startConfig = generateStartJsonObject(appName, appUrl, config);
            saveObjectAsJson(startConfig, "app.json");
            toggleActionButtonVisibility();
            createInstallerButton.focus();
        });
        event.preventDefault();
    };

    var createInstaller = function(mainWindow, event) {
        fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/deploy-app.html');
        toggleActionButtonVisibility();
        event.preventDefault();
    };

    //saves an
    var saveObjectAsJson = function(obj, filename) {
        var downloadLink = document.createElement('a'),
            json = JSON.stringify(obj, undefined, 4),
            dataBlob = new Blob([json], {
                type: "octet/stream"
            }),
            blobUrl = URL.createObjectURL(dataBlob);

        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        downloadLink.click();
    };
}());
