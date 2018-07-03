const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//Set middleware
app.use( bodyParser.json() );

app.post('/todos', (req, res) => {

	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then( (doc) =>{
		res.send(doc);
	}, (e) =>{
		res.status(400).send( e );
	});

});

app.get('/todos', (req, res)=>{
	//Find all todos and return them
	Todo.find().then( (todos)=>{
		res.send({todos}); //use object to hold array for flexibility
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res)=>{
	
	if( !ObjectID.isValid( req.params.id ) ){
		//Invalid id, return 404
		return res.status(404).send();
	}

	//Search for todo by id
	Todo.findById( req.params.id ).then( (todo) => {

		if( todo ){
			//If exists return todo
			res.send( todo ); 
		} else {
			//Todo not found return 404
			res.status(404).send();
		}
		
	}, (e)=>{
		//Something blew up return 400
		res.status(400).send();
	});
	
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app};