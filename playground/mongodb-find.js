// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, db)=>{

	if(err){
		return console.log('Unable to connect to mongo database server');
	}

	console.log('Connected to mongoDB server');

	// db.collection('Todos').find({
	// 	_id: new ObjectID( '5b3824753e1e78e36eff4747' )
	// }).toArray().then(( docs ) => {
	// 	console.log( 'Todos:' );
	// 	console.log(JSON.stringify( docs, undefined, 2 ));
	// }, ( err ) =>{
	// 	console.log('Unable to fetch todos', err );
	// });

	// db.collection('Todos').find().count().then(( count ) => {
	// 	console.log( `Todos Count: ${count}` );
	// }, ( err ) =>{
	// 	console.log('Unable to fetch todos', err );
	// });

	db.collection('Users').find({
		name: 'Erin'
	}).toArray().then(( docs ) => {
		console.log( 'Users:' );
		console.log(JSON.stringify( docs, undefined, 2 ));
	}, ( err ) =>{
		console.log('Unable to fetch users', err );
	});

	//db.close();
});

