var mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minLength: 1,
		trim: true
	}
});

module.exports = {User};
// var newUser = new User({
// 	email: 'erin.osekmedia@gmail.com'
// });

// newUser.save().then( (user)=>{
// 	console.log( JSON.stringify(user, undefined, 2 ));
// }, (e)=>{
// 	console.log('Unable to save user.', e );
// });

// var newUserEmpty = new User({
// 	email: ''
// });

// newUserEmpty.save().then( (user)=>{
// 	console.log( JSON.stringify(user, undefined, 2 ));
// }, (e)=>{
// 	console.log('Unable to save user.' );
// });