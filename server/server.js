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

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app};