// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);
MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, db)=>{

	if(err){
		return console.log('Unable to connect to mongo database server');
	}

	console.log('Connected to mongoDB server');

	// db.collection('Todos').insertOne({
	// 	text: 'something todo',
	// 	completed: false
	// }, (err, res) => {
	// 	if(err){
	// 		return console.log('Unable to insert todo record', err );
	// 	}

	// 	console.log(JSON.stringify(res.ops, undefined, 2 ));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Erin',
	// 	age: 37,
	// 	location: 'Phoenix'
	// }, (err, res) => {
	// 	if(err){
	// 		return console.log('Unable to insert user record', err );
	// 	}

	// 	//Get timestamp object id was created 
	// 	console.log( res.ops[0]._id.getTimestamp() );

	// 	console.log(JSON.stringify(res.ops, undefined, 2 ));
	// });

	db.close();
});


//mongodb module 3 updates
// const MongoClient = require('mongodb').MongoClient;

// MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, client)=>{ //updated args

// 	if(err){
// 		return console.log('Unable to connect to mongo database server');
// 	}

// 	const db = client.db('TodoApp'); //added line

// 	console.log('Connected to mongoDB server');

// 	db.collection('Todos').insertOne({
// 		text: 'something todo',
// 		completed: false
// 	}, (err, res) => {
// 		if(err){
// 			return console.log('Unable to insert todo record', err );
// 		}

// 		console.log(JSON.stringify(res.ops, undefined, 2 ));
// 	});
// 	client.close(); //updated close to use client
// });