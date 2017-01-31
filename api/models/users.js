var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = null;

UserSchema = mongoose.Schema({
    local : {
        email : {
            type : String,
            unique : true
        },
        password : String
    },
    // google : {
    //     id : String,
    //     token : String,
    //     email : String, 
    //     name : String
    // }
});

UserSchema.methods.generateHash = function (password) {
    'use strict'

    return bcrypt.hash(password, bcrypt.genSalt(10), null);
};


UserSchema.methods.validPassword = function (password) {
    'use strict'

    return bcrypt.compare(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);