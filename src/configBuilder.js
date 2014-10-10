var fs = require('fs'),
    path = require('path');

module.exports = {
    build: function(targetUrl, callback) {
        var configFilePath = path.resolve('public/app.json');

        //update app.json with user propmts
        fs.readFile(configFilePath, function(err, data) {
            var appConfig = JSON.parse(data),
                iconUrl = targetUrl + '/img/openfin.ico';

            //modify our app.config file.
            appConfig.startup_app.url = targetUrl;
            appConfig.startup_app.applicationIcon = iconUrl;
            appConfig.shortcut.icon = iconUrl;

            fs.writeFile(configFilePath, JSON.stringify(appConfig, null, "    "), function(err) {
                if (err) throw err;
                console.log('public/app.json formatted');
                callback();
            });
        });
    }
};
