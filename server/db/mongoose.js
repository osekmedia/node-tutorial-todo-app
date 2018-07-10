var mongoose = require('mongoose');

//Set promise library to global promise lib
mongoose.Promise = global.Promise;
//Connect mongoose to mongo db
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp' );


module.exports = { mongoose };