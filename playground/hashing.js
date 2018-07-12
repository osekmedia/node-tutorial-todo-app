const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123abc!';
bcrypt.genSalt(10, (err, salt)=>{
	console.log(salt);
	bcrypt.hash( password, salt, (err, hash)=>{
		console.log(hash);
	});
});

var hashedPassword = "$2a$10$pn0pOcKOuZE0/3WKf7XuU.UUcYSXCN1tDN2/itWXFDqhyzl1kEv2O";
bcrypt.compare('password', hashedPassword, (err, res)=>{
console.log(res);
});
// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded );
// var message = 'Some user here';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256( JSON.stringify( data ) + 'someSalt' ).toString()
// };

// // token.data.id  = 5;
// // token.hash = SHA256( JSON.stringify( token.data )  ).toString()

// var resultHash = SHA256( JSON.stringify( token.data ) + 'someSalt' ).toString()

// if(resultHash === token.hash ){
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed, dont trust!!');
// }
// 	