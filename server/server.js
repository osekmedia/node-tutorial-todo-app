require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT;

//Set middleware
app.use( bodyParser.json() );

app.post('/todos', authenticate, (req, res) => {

	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then( (doc) =>{
		res.send(doc);
	}, (e) =>{
		res.status(400).send( e );
	});

});

app.get('/todos', authenticate, (req, res)=>{
	//Find all todos and return them
	Todo.find({
		_creator: req.user._id
	}).then( (todos)=>{
		res.send({todos}); //use object to hold array for flexibility
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res)=>{
	
	if( !ObjectID.isValid( req.params.id ) ){
		//Invalid id, return 404
		return res.status(404).send();
	}

	//Search for todo by id
	Todo.findOne( {
		_id: req.params.id, 
		_creator: req.user._id
	}).then( (todo) => {

		if( todo ){
			//If exists return todo
			res.send( {todo} ); 
		} else {
			//Todo not found return 404
			res.status(404).send();
		}
		
	}).catch( (e)=>{
		//Something blew up return 400
		res.status(400).send();
	});
	
});

app.delete('/todos/:id', authenticate, (req, res)=>{

	var id = req.params.id;

	if( !ObjectID.isValid( id ) ){
		//Invalid id, return 404
		return res.status( 404 ).send();
	}

	Todo.findOneAndRemove( {
		_id: id,
		_creator: req.user._id
	} ).then( (todo) => {

		if( !todo ){
			return res.status(404).send();	
		}

		res.send( {todo} ); 
		
	}).catch( (e) => {
		//Something blew up return 400
		res.status( 400 ).send();
	});

});

app.patch('/todos/:id', authenticate, (req, res) => {

	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if( !ObjectID.isValid( id ) ){
		return res.status( 404 ).send();
	}

	if( _.isBoolean( body.completed ) && body.completed ){
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate( { 
		_id: id, 
		_creator: req.user._id 
	}, { $set: body } , { new: true } ).then( (todo) => {

		if(!todo){
			return res.status(404).send();
		}

		res.send({todo});

	}).catch( (e) => { 
		res.status(400).send();
	});

});


//users
app.post('/users', (req, res) => {

	var body = _.pick(req.body, ['email', 'password']);
	var user = new User( body );
	
	user.save().then( () => {
		return user.generateAuthToken();
	}).then( (token)=>{
		res.header( 'x-auth', token ).send( user );
	}).catch( (e) => {
		res.status(400).send( e );
	});

});

//Authenticated route, using authenticate middleware
app.get('/users/me', authenticate, (req, res)=>{
	res.send( req.user );
});

app.post('/users/login', (req, res) => {

	var body = _.pick(req.body, ['email', 'password']);

	User.findByCridentials( body.email, body.password ).then( (user) => {
		return user.generateAuthToken().then( (token) => {
			res.header( 'x-auth', token ).send( user );
		});
	}).catch( ( e ) => { 
		res.status(400).send();
	});

});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};