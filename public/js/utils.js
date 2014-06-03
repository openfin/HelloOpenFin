var utils = utils || {};
(function() {
    'use strict';

    utils.extend = function(source, origin) {
        for (var key in origin) {
            if (origin.hasOwnProperty(key)) {
                source[key] = origin[key];
            }
        }
        return source;
    };

}());
