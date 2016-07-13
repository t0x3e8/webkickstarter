var homecontroller = (function () {
    'use strict';
    
    var index = function (req, res, next) {
        res.render('homeindex', {title: 'This is Index page!'});
    };

    var about = function (req, res, next) {
        res.render('homeabout', {title: 'This is About page!'});
    };

    return {
        'index' : index,
        'about' : about
    };
}());


module.exports = homecontroller;  