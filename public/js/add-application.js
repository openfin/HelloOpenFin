(function() {
    'use strict';
    var closeButton = document.getElementById('close-app'),
        minimizeButton = document.getElementById('minimize-window'),
        generateRVMJsonButton = document.getElementById('generate-rvm-json'),
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
        generateRVMJsonButton.addEventListener('click', function(e) {
            generateRVMJson(mainWindow, newAppForm, e);
        });
        generateApplicationJsonButton.addEventListener('click', function(e) {
            generateApplicationJson(mainWindow, newAppForm, e);
        });
        createInstallerButton.addEventListener('click', function(e) {
            createInstaller(mainWindow, e);
        });
    };

    var adjustButtonVisibility = function() {
        if (generateRVMJsonButton.style.display === '') {
            generateRVMJsonButton.style.display = 'none';
            generateApplicationJsonButton.style.display = '';
            createInstallerButton.style.display = 'none';
        } else if (generateApplicationJsonButton.style.display === '') {
            generateRVMJsonButton.style.display = 'none';
            generateApplicationJsonButton.style.display = 'none';
            createInstallerButton.style.display = '';
        } else {
            generateRVMJsonButton.style.display = '';
            generateApplicationJsonButton.style.display = 'none';
            createInstallerButton.style.display = 'none';
        }
    };
    var generateRVMJson = function(mainWindow, newAppForm, event) {
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
            var aConfig = {
                "company": appName,
                "description": appName,
                "icon": iconUrl,
                "name": appName,
                "runtime": config.env,
                "runtimeArgs": "",
                "appConfig": appUrl + "/start.json"
            };
            saveObjectAsJson(aConfig, "manifest.json");
            adjustButtonVisibility();
        });
        event.preventDefault();
    };

    var generateApplicationJson = function(mainWindow, newAppForm, event) {
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

            var aConfig = {
                "desktop_controller_url": "https://openf.in/desktop/desktopcontroller",
                "desktop_core_url": "https://openf.in/desktop/desktopcore/",
                "env": appName + "CacheFolder",
                "startup_app": {
                    "name": appName,
                    "url": appUrl, //or wherever you application is hosted
                    "uuid": appUrl + "UUID"
                }
            };
            saveObjectAsJson(aConfig, "start.json");
            adjustButtonVisibility();
        });
        event.preventDefault();
    };

    var createInstaller = function(mainWindow, event) {
        //TODO:change to the actual url.
        fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/first-look.html');
        adjustButtonVisibility();
        event.preventDefault();
    };

    //saves an javascript object to a json file.
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
