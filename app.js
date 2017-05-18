var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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
		.exec(function(err, books) {
			if(err) {
				res.send('error has occured');
			} else {
				console.log(books);
				res.json(books);
			}
		})
});

app.get('/books/:id', function(req,res) {
	console.log('getting one book');
	Book.findOne({
		_id: req.params.id
	})
	.exec(function(err, book) {
		if(err) {
			res.send('error occured');
		} else {
			console.log(book);
			res.json(book);
		}
	})
});
// first and main way of creating
app.post('/book', function(req, res) {
	var newBook = new Book();

	newBook.title = req.body.title;
	newBook.author = req.body.author;
	newBook.category = req.body.category;

	newBook.save(function(err, book) {
		if(err) {
			res.send('error saving boko');
		} else {
			console.log(book);
			res.send(book);
		}
	})
});
// second way of creating
app.post('/book2', function(req,res) {
	Book.create(req.body, function(err, book) {
		if(err) {
			res.send('error saving book');
		} else {
			console.log(book);
			res.send(book);
		}
	})
})

app.listen(port);
