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

    utils.extend = function(source, origin) {
        for (var key in origin) {
            if (origin.hasOwnProperty(key)) {
                source[key] = origin[key];
            }
        }
        return source;
    };

}());
