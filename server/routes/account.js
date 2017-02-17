var backendController = require('../controllers/backendcontroller')();

var accountRouting = function (router, passport) {
    'use strict'

    router.get('/post/new', backendController.ensureAuthentication, backendController.addPost);
    router.post('/post/new', backendController.ensureAuthentication, backendController.doAddPost, backendController.addPost);
    router.get('/login', backendController.login);
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/account/login',
        failureFlash: true
    }));
    router.get('/register', backendController.register);
    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/account/register',
        failureFlash: true
    }));
    router.get('/logout', backendController.logout);

    return router;
};

module.exports = accountRouting;