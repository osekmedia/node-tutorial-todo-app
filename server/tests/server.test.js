const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach( populateUsers );
beforeEach( populateTodos );

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				//Check database for test value
				Todo.find({text}).then((todos)=>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch( (e) => done(e) );
			});
	});

	it('Should not create todo with invalid body', (done)=>{
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		.expect(400)
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Todo.find().then((todos)=>{
				expect(todos.length).toBe(2);
				done();
			}).catch( (e) => done(e) );

		});
	});
});

describe('GET /todos', () => {
	it('Should get all todos', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(1);
			}).end( done );
	});
});

describe('GET /todos/:id', () => {
	it('Should get a todo by id', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			}).end( done );
	});

	it('Should return a 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end( done );
	});

	it('Should return a 404 for non-ObjectID format', (done) => {
		request(app)
			.get('/todos/abc123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end( done );
	});

	it('Should not get a todo created by other user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end( done );
	});
});

describe('DELETE /todos/:id', () => {

	it('Should remove a todo', (done) => {

		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo._id).toBe(hexId);
			}).end( (err, res) => {

				if(err){
					return done(err);
				}

				Todo.findById( hexId ).then((todo)=>{
					expect( todo ).toBeFalsy();
					done();
				}).catch( (e) => done(e) );

			});
	});

	it('Should not remove a todo a user did not create', (done) => {

		var hexId = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end( (err, res) => {

				if(err){
					return done(err);
				}

				Todo.findById( hexId ).then((todo)=>{
					expect( todo ).toBeTruthy();
					done();
				}).catch( (e) => done(e) );

			});
	});

	it('Should return a 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end( done );
	});

	it('Should return a 404 for invalid ObjectID format', (done) => {
		request(app)
			.delete('/todos/abc123')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end( done );
	});
});

describe('PATCH /todos/:id', () => {

	it('Should update the todo', (done)=>{

		var hexId = todos[0]._id.toHexString();
		var text = 'First test todo updated';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({text, completed: true})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');

			}).end( done );

	});

	it('Should not update the todo created by other user', (done)=>{

		var hexId = todos[0]._id.toHexString();
		var text = 'First test todo updated';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({text, completed: true})
			.expect(404)
			.end( done );

	});

	it('Should clear completedAt when completed false', (done)=>{

		var hexId = todos[1]._id.toHexString();
		var text = 'Second test todo updated';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({text, completed: false})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeFalsy();
			}).end( done );

	});

});


describe('GET /users/me', () => {
	it('Should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect( (res) => {
				expect(res.body._id).toBe( users[0]._id.toHexString() );
				expect(res.body.email).toBe( users[0].email );
			}).end(done);
	});

	it('Should return ua 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect( (res) => {
				expect(res.body).toEqual( {} );
			}).end(done);
	});
});

describe('POST /users', () => {

	it('Should create a user', (done) => {

		var email = 'example@example.com';
		var password = 'testPassword1';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect( (res) =>{
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			}).end((err) => {

				if(err){
					return done(err);
				}

				User.findOne({email}).then((user)=>{
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					expect(user.email).toBe(email);
					done();
				}).catch( (e) => done(e) );
			});

	});

	it('Should return validation errors if request is invalid', (done) => {

		var email = 'example.com';
		var password = '1';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.expect( (res) =>{
				expect(res.headers['x-auth']).toBeFalsy();
				expect(res.body._id).toBeFalsy();
			}).end( done );

	});

	it('Should not create user if email in use', (done) => {

		request(app)
			.post('/users')
			.send({
				email: users[0].email, 
				password: users[0].password})
			.expect(400)
			.expect( (res) =>{
				expect(res.headers['x-auth']).toBeFalsy();
				expect(res.body._id).toBeFalsy();
			}).end( done );

	});
});

describe('POST /users/login', () => {

	it('Should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect( ( res ) => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end( (err, res) => {
				if(err){
					return done(err);
				}
				User.findById(users[1]._id).then((user) => {
					expect(user.toObject().tokens[1]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch( (e) => done(e) );
			});
	});

	it('Should reject an invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'invalid'
			})
			.expect(400)
			.expect( ( res ) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end( (err, res) => {
				if(err){
					return done(err);
				}
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch( (e) => done(e) );
			});
	});

});

describe( 'DELETE /users/me/token', () => {
	it('Should delete auth token on log out', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end( (err, res) => {
				if(err){
					return done(err);
				}
				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch( (e) => done(e) );
			});
	});
});