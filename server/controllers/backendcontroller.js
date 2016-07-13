var backendcontroller = (function () {
    'use strict';
    
    var index = function (req, res, next) {
        res.render('backendIndex', {title: 'This is Backend Index page!'});
    };

    return {
        'index' : index
    };
}());


module.exports = backendcontroller;  