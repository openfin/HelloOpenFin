(function() {
    'use strict';
    //get a hold of the elements we will interact with.
    var closeButton = document.querySelector('#close-app'),
        minimizeButton = document.querySelector('#minimize-window'),
        generateApplicationJsonButton = document.querySelector('#generate-application-json'),
        backButton = document.querySelector('#back-button'),
        newAppForm = document.querySelector('#newAppForm'),
        deployappLinks = document.querySelectorAll('.deployappLink'),
        flipContainer = document.querySelector('.two-sided-container');

    document.addEventListener('DOMContentLoaded', function() {

        //request the window
        var mainWindow = fin.desktop.Window.getCurrent(),
            draggableArea = document.querySelector('.container');

        //set event emiters.
        setEventEmmiters(mainWindow);

        //set the drag animations.
        animations.defineDraggableArea(mainWindow, draggableArea);

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
        backButton.addEventListener('click', function(e) {
            flipDisplay();
        });
        for (var i = 0; i < deployappLinks.length; i++) {
            deployappLinks[i].addEventListener('click', deployappLinkAction);
        }
    };

    var flipDisplay = function() {
        flipContainer.classList.toggle("flip");
    };

    var generateAppJsonObject = function(appName, url, config) {
        return {
            default_icon: config.default_icon,
            startup_app: {
                autoShow: true,
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
            //generate a new app.json file
            var startConfig = generateAppJsonObject(appName, appUrl, config);
            //flip to the next page.
            flipDisplay();

            //wait a bit before displaying the download.
            setTimeout(function() {
                saveObjectAsJson(startConfig, "app.json");
            }, 700);
        });
        event.preventDefault();
    };

    var deployappLinkAction = function(mainWindow, event) {
        fin.desktop.System.openUrlWithBrowser('http://openfin.co/developers.html?url=developers/getting-started/deploy-app.html');
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
