const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id = '5b39baa00bacca45615ad0c8';


if( !ObjectID.isValid(id) ){
	console.log('Invalid ID');
} else {
	
	User.findById(id).then((user)=>{
		if(!user){
			return console.log('User not found');
		}
		console.log( JSON.stringify( user, undefined, 2 ) );
	}).catch((e)=>{
		console.log( e );
	});

}





// Todo.find({
// 	_id: id
// }).then((todos)=>{
// 	console.log('Todos: ', todos );
// });

// Todo.findOne({
// 	_id: id
// }).then((todo)=>{
// 	console.log('Todo: ', todo );
// });

// Todo.findById(id).then((todo)=>{
// 	if(!todo){
// 		return console.log('ID not found');
// 	}
// 	console.log('Todo by id: ', todo );
// }).catch((e)=>{
// 	console.log( e );
// });