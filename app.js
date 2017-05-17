var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');

var db = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mongoose-ex';

mongoose.connect(db);

var port = process.env.PORT || 8080;

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

app.listen(port);
