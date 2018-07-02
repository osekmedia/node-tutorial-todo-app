var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minLength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo};



// var newTodo = new Todo({ text: 'My new todo' });

// newTodo.save().then( (doc)=>{
// 	console.log('Saved todo', doc );
// }, (e) => {
// 	console.log('Unable to save todo.');
// } );

// var newTodo = new Todo({
// 	text: 'Eat Dinner', 
// 	completed: true, 
// 	completedAt: Math.round((new Date()).getTime() / 1000) 
// });

// newTodo.save().then( (doc)=>{
// 	console.log('Saved todo', doc );
// }, (e) => {
// 	console.log('Unable to save todo.');
// } );