var cpu = cpu || {};
(function() {
    'use strict';

    function genConfig() {
        var rand = Math.random();
        return {
            "name": "cpuChild" + (rand * 100) % 40 ,
            "defaultWidth": 960,
            "defaultHeight": 390,
            "autoShow": true,
            "url": 'views/cpu.html',

            "cornerRounding" : {
                "width" : 5,
                "height" : 5
            },
            "frame" : false,
            "resizable": false


        };
    }


    cpu.open = function() {

        var config = genConfig();

        var cpuWindow = new fin.desktop.Window(config, function() {

        }, function(err) {
            console.log('this was the err', err);
        });

        return cpuWindow;
    };
})();
