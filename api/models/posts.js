/* eslint object-property-newline : off
*/

var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    content: { type: String, 'require': true },
    author: { type: String, 'require': true },
    date: { type: Date, 'default': Date.now }
})

var postSchema = new mongoose.Schema({
    title: { type: String, 'require': true },
    content: String,
    date: { type: Date, 'default': Date.now },
    comments: [commentSchema]
});

mongoose.model('Post', postSchema);

