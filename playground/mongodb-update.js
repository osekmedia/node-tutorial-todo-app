// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, db)=>{

	if(err){
		return console.log('Unable to connect to mongo database server');
	}

	console.log('Connected to mongoDB server');

	// db.collection('Todos').findOneAndUpdate(
	// 	{
	// 		_id: new ObjectID('5b3994c03e1e78e36eff5279')
	// 	},
	// 	{
	// 		$set: {
	// 			completed: true
	// 		}
	// 	},
	// 	{
	// 		returnOriginal: false
	// 	}
	// ).then( result => {
	// 	console.log(result);
	// });


	db.collection('Users').findOneAndUpdate(
		{
			_id: new ObjectID('5b39970a3e1e78e36eff5346')
		},
		{
			$set: {
				name: 'Erin'
			},
			$inc: {
				age: 1
			}

		},
		{
			returnOriginal: false
		}
	).then( result => {
		console.log(result);
	});

	//db.close();
});

// {
//     text: 'eat lunch',
//     completed: false
// }