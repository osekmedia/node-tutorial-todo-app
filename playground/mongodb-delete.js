// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, db)=>{

	if(err){
		return console.log('Unable to connect to mongo database server');
	}

	console.log('Connected to mongoDB server');

	//delete many
	// db.collection('Todos').deleteMany({text: 'eat lunch'}).then( (result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').deleteMany({name: 'Erin'}).then( (result) => {
	// 	console.log(result);
	// });

	//delete one

	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then( (result) => {
	// 	console.log(result);
	// });
	db.collection('Users').deleteOne({_id: new ObjectID('5b3820c30581c5514ebc26bf') }).then( (result) => {
		console.log(result);
	});
	//find one and delete
	// db.collection('Todos').findOneAndDelete({completed: false}).then( (result) => {
	// 	console.log(result);
	// });

	//db.close();
});

// {
//     text: 'eat lunch',
//     completed: false
// }