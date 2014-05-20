var cpu = cpu || {};
(function() {
    'use strict';

    function genConfig() {
        var rand = Math.random();
        return {
            name: "cpuChild" + rand,
            defaultWidth: 960,
            defaultHeight: 390,
            autoShow: true,
            url: 'views/cpu.html'
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
