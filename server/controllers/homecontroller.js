var homecontroller = (function () {
    'use strict';
    
    var home = function (req, res, next) {
        res.render('index', {title: 'This is Home page!'});
    };

    var about = function (req, res, next) {
        res.render('index', {title: 'This is About page!'});
    };

    return {
        'home' : home,
        'about' : about
    };
}());


module.exports = homecontroller;  