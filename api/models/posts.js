/* eslint object-property-newline : off
*/

var mongoose = require('mongoose');
var config = require('config');
var options = {};
var commentSchema = null;
var postSchema = null;

if (config.util.getEnv('NODE_ENV') === 'test') {
    options = { _id: true };
}

commentSchema = new mongoose.Schema({
    content: { type: String, 'require': true },
    author: { type: String, 'require': true },
    date: { type: Date, 'default': Date.now },
}, options);

postSchema = new mongoose.Schema({
    title: { type: String, 'require': true },
    content: String,
    date: { type: Date, 'default': Date.now },
    comments: [commentSchema]
}, options);

mongoose.model('Post', postSchema);

