var {User} = require('./../models/user');

//Add authentication middleware function
var authenticate = (req, res, next) => {

	var token = req.header('x-auth');

	User.findByToken( token ).then((user) => {

		if(!user){
			return Promise.reject(); //Force promise to fail and trigger catch method
		}

		req.user = user;
		req.token = token;
		next();

	}).catch( (e) =>{
		res.status(401).send();
	});

};

module.exports = {authenticate};