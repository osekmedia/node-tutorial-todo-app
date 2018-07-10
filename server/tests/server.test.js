const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [
	{text: 'First test todo', _id: new ObjectID()}, 
	{text: 'Second test todo', _id: new ObjectID()}
];

beforeEach((done) => {
	Todo.remove({}).then( () => {
		return Todo.insertMany(todos);
	}).then( () => done() );
});

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
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
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2);
			}).end( done );
	});
});

describe('GET /todos/:id', () => {
	it('Should get a todo by id', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			}).end( done );
	});

	it('Should return a 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end( done );
	});

	it('Should return a 404 for non-ObjectID format', (done) => {
		request(app)
			.get('/todos/abc123')
			.expect(404)
			.end( done );
	});
});

describe('DELETE /todos/:id', () => {

	it('Should remove a todo', (done) => {

		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo._id).toBe(hexId);
			}).end( (err, res) => {

				if(err){
					return done(err);
				}

				Todo.findById( hexId ).then((todo)=>{
					expect( todo ).toNotExist();
					done();
				}).catch( (e) => done(e) );

			});
	});

	it('Should return a 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end( done );
	});

	it('Should return a 404 for invalid ObjectID format', (done) => {
		request(app)
			.delete('/todos/abc123')
			.expect(404)
			.end( done );
	});
});