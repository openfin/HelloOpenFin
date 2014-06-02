(function() {
    'use strict';
    var setEventEmmiters = function(mainWindow) {
        var closeButton = document.getElementById('close-app'),
            minimizeButton = document.getElementById('minimize-window'),
            generateJsonButton = document.getElementById('generate-json'),
            createInstallerButton = document.getElementById('create-installer'),
            formElements = document.querySelector('.center-form').querySelectorAll('input');

        closeButton.addEventListener('click', function() {
            mainWindow.hide();
        });

        minimizeButton.addEventListener('click', function() {
            mainWindow.minimize();
        });
        generateJsonButton.addEventListener('click', function(e) {
            generateJson(mainWindow, formElements, e);
        });
        createInstallerButton.addEventListener('click', function() {
            createInstaller(mainWindow);
        });
    };

    var generateJson = function(mainWindow, formElements, event) {
        var appName,
            appUrl,
            iconUrl,
            formElement;

        for (var i = 0; i < formElements.length; i++) {
            formElement = formElements[i];
            if (!formElements[i].checkValidity()) {
                return;
            }
            if (formElement.id === 'appName') {
                appName = formElement.value;
            } else if (formElement.id === 'startURL') {
                appUrl = formElement.value;
            } else if (formElement.id === 'iconUrl') {
                iconUrl = formElement.value;
            }
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
        });
        event.preventDefault();
    };
    var createInstaller = function(mainWindow) {
        console.log('create installer');
    };
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

    document.addEventListener('DOMContentLoaded', function() {
        fin.desktop.main(function() {
            //request the window
            var mainWindow = fin.desktop.Window.getCurrent(),
                draggableArea = document.querySelector('.container');

            //set event emiters.
            setEventEmmiters(mainWindow);

            //set the drag animations.
            mainWindow.defineDraggableArea(draggableArea, function(data) {
                mainWindow.animate({
                    opacity: utils.transparentOpacityAnimation,
                }, {
                    interrupt: false
                });
            }, function(data) {
                mainWindow.animate({
                    opacity: utils.solidOpacityAnimation
                }, {
                    interrupt: false
                });
            }, function(err) {
                console.log(err);
            });
        });
    });
}());
