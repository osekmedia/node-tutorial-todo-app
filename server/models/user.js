const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function(token){
	var user = this;

	//Using mongo db $pull to filter array of tokens
	return user.update({
		$pull: {
			tokens: { token }
		}
	});
};

//Model method
UserSchema.statics.findByToken = function( token ){
	var User = this;
	var decoded;

	try{
		decoded = jwt.verify( token, 'asdf1234' );
	} catch(e){
		return Promise.reject(); //return rejected promise
	}
	
	return User.findOne( { 
		'_id': decoded._id,
		'tokens.token':token,
		'tokens.access': 'auth'
	} );
};

UserSchema.statics.findByCridentials = function( email, password ){
	var User = this;
	//var hash;
	
	return User.findOne( {email} ).then( (user)=>{
		if(!user){
			return Promise.reject();
		}

		return new Promise( (resolve, reject )=>{
			//Compare encrypted passwords and resolve promise if success otherwise reject
			//bcrypt uses callback so muct wrap inside promise
			bcrypt.compare(password, user.password, (err, res)=>{
				if(res){
					resolve( user );
				} else {
					reject();
				}
			});
		});
	});
};

//Hash password before save
// https://www.npmjs.com/package/bcryptjs
// http://mongoosejs.com/docs/middleware.html
UserSchema.pre('save', function(next) {
  var user = this;

  if( user.isModified('password') ){

  	bcrypt.genSalt(10, (err, salt)=>{
		bcrypt.hash( user.password, salt, (err, hash)=>{
			user.password = hash;
			next();
		});
	});


  } else {
  	next();
  }
  
});

//Override toJSON function to limit data returned to user
UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject(); //convert mongoose obj to regular object
	return _.pick( userObject, ['_id', 'email'] );
};

var User = mongoose.model( 'User', UserSchema );

module.exports = {User};
