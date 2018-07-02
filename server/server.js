var mongoose = require('mongoose');

//Set promise library to global promise lib
mongoose.Promise = global.Promise;
//Connect mongoose to mongo db
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}
});

var newTodo = new Todo({
	text: 'Eat Dinner', 
	completed: true, 
	completedAt: Math.round((new Date()).getTime() / 1000) 
});

newTodo.save().then( (doc)=>{
	console.log('Saved todo', doc );
}, (e) => {
	console.log('Unable to save todo.');
} );
