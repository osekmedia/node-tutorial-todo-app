const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'osekmedia@gmail.com',
	password: 'myAwesomePassword',
	tokens: [{
		access: 'auth',
		token: jwt.sign( { _id: userOneId.toHexString(), access: 'auth' }, process.env.JWT_SECRET ).toString()
	}]
},{
	_id: userTwoId,
	email: 'someone@gmail.com',
	password: 'myAwesomePassword2',
	tokens: [{
		access: 'auth',
		token: jwt.sign( { _id: userTwoId.toHexString(), access: 'auth' }, process.env.JWT_SECRET ).toString()
	}]
}];

const todos = [{
	text: 'First test todo', 
	_id: new ObjectID(),
	_creator: userOneId
}, 
{
	text: 'Second test todo', 
	_id: new ObjectID(), completed: true, 
	completedAt: 333,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.remove({}).then( () => {
		return Todo.insertMany(todos);
	}).then( () => done() );
};

const populateUsers = (done) => {
	User.remove({}).then( () => {
		var userOne = new User( users[0] ).save();
		var userTwo = new User( users[1] ).save();

		//process all promises in array
		return Promise.all([userOne, userTwo]);
	}).then( () => done() );
};

module.exports = {todos, populateTodos, users, populateUsers};