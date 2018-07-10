const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');


// Todo.remove({}).then( (result) => {
// 	console.log(result);
// });

// Todo.findByIdAndRemove({_id: '5b4425e36580383dbb5c7a1f'}).then( (doc) => {
// 	console.log(doc);
// });

Todo.findByIdAndRemove('5b4425e36580383dbb5c7a1f').then( (doc) => {
	console.log(doc);
});


// if( !ObjectID.isValid(id) ){
// 	console.log('Invalid ID');
// } else {
	
// 	User.findById(id).then((user)=>{
// 		if(!user){
// 			return console.log('User not found');
// 		}
// 		console.log( JSON.stringify( user, undefined, 2 ) );
// 	}).catch((e)=>{
// 		console.log( e );
// 	});

// }

