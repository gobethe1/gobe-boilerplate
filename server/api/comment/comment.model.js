'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  body: String,
  createdAt: {type: Date, default: Date.now()},
  updatedAt: Date
});

CommentSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next()
})

module.exports = mongoose.model('Comment', CommentSchema);