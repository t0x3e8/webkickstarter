var backendController = require('../controllers/backendcontroller')();

var accountRouting = function (router, passport) {
    'use strict'

    router.get('/post/new', backendController.addPost);
    router.post('/post/new', backendController.doAddPost, backendController.addPost);
    router.get('/login', backendController.login);
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/account/login'
    }));
    router.get('/register', backendController.register);
    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/account/register'
    }));
    router.get('/logout', backendController.logout);

    return router;
};

module.exports = accountRouting;