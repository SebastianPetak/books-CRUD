var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Book = require('./Book.model');
var port = process.env.PORT || 8080;
var db = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mongoose-ex';


mongoose.connect(db);

// Use bodyParser to parse json elements
app.use(bodyParser.json())
// Use urlencoded to give and recieve body elements through the url
// Will be used with postman
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res) {
	res.send('We are at index')
});

app.get('/books', function(req, res) {
	console.log('getting all books');
	Book.find({})
	.exec()
	.then(function(books) {
		console.log(books);
		res.json(books);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	});
});

app.get('/books/:id', function(req,res) {
	console.log('getting one book');
	Book.findOne({
		_id: req.params.id
	})
	.exec()
	.then(function(book) {
		console.log(book);
		res.json(book);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	});
});
// first and main way of creating. Less Errors this way
// ensures data adhears to model?
app.post('/book', function(req, res) {
	var newBook = new Book();

	newBook.title = req.body.title;
	newBook.author = req.body.author;
	newBook.category = req.body.category;

	newBook.save()
	.then(function(book) {
		console.log(book);
		res.send(book);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	})
});
// second way of creating
app.post('/book2', function(req,res) {
	Book.create(req.body)
	.then(function(book) {
		console.log(book);
		res.send(book);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	});
});
// Update a book (one way to update)
app.put('/book/:id', function(req, res) {
	Book.findOneAndUpdate(
	{_id: req.params.id},
	{$set: {title: req.body.title,
		 			author: req.body.author,
					category: req.body.category}},
	{upsert: true, new: true})
	.then(function(book) {
		console.log(book);
		res.status(201).send(book);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	});
});

app.delete('/book/:id', function(req, res) {
	Book.findOneAndRemove({
		_id: req.params.id
	})
	.then(function(book) {
		console.log(book);
		res.status(204);
	})
	.catch(function(err) {
		res.status(500).send({ error: 'Error occured' });
	});
});

app.listen(port);
