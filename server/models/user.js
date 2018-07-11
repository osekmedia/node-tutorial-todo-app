const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minLength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minLength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}	
	}]
});

//Create instance method to generate token || need access to this so we use a regular function
UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({ _id: user._id.toHexString(), access }, 'asdf1234').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	return user.save().then(() => {
		return token;
	});
};

//Override toJSON function to limit data returned to user
UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject(); //convert mongoose obj to regular object
	return _.pick( userObject, ['_id', 'email'] );
};

var User = mongoose.model( 'User', UserSchema );

module.exports = {User};
