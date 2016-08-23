/* eslint 
    no-unused-vars: ["error", { "argsIgnorePattern": "^next" }] 
    max-len: ["error", {"code" : 256}]    
*/
var request = require('request');

var homecontroller = (function () {
    'use strict';

    var apiAddress = 'http://localhost:3000';

    var index = function (req, res, next) {
        var reqOptions = {
            url : apiAddress + '/api/posts',
            method : 'GET',
            json : {}
        };

        request(reqOptions, function (err, response, data) {
            if (!err && response.statusCode === 200) {  
                res.render('homeindex', {
                    title: 'Jenny from the blog', 
                    posts : data
                });
            } else if (err) {
                res.json(err);
                res.status(404);
            }
        });
    };

    var about = function (req, res, next) {
        res.render('homeabout', {title: 'Jenny from the blog'});
    };

    return {
        'index' : index,
        'about' : about
    };
}());

module.exports = homecontroller;  