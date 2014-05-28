var utils = utils || {};
(function() {
    'use strict';

    var transitionDuration = 200,
        transparentOpacityVal = 0.7;

    //transparency animation used.
    utils.transparentOpacityAnimation = {
        opacity: transparentOpacityVal,
        //time in ms
        duration: transitionDuration
    };

    //solid animation options used.
    utils.solidOpacityAnimation = {
        opacity: 1,
        //time in ms.
        duration: transitionDuration
    };

    //margin between the main window and the cpu window.
    utils.cpuWindowMargin = 10;


    utils.extend = function(source, origin) {
        for (var key in origin) {
            if (origin.hasOwnProperty(key)) {
                source[key] = origin[key];
            }
        }
        return source;
    };

}());
