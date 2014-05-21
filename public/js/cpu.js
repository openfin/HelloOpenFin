var cpu = cpu || {};
(function() {
    'use strict';

    cpu.open = function(callback) {
        var config = {
            "name": "cpuChild",
            "defaultWidth": 525,
            "defaultHeight": 395,
            "maxWidth": 525,
            "maxHeight": 395,
            "autoShow": false,
            "url": 'views/cpu.html',
            "cornerRounding": {
                "width": 5,
                "height": 5
            },
            "frame": false,
            "resizable": false
        };

        var cpuWindow = new fin.desktop.Window(config, callback, function(err) {
            console.log('this was the err', err);
        });

        return cpuWindow;
    };
})();
