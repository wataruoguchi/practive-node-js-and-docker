var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/dockerdemo';
var db;

MongoClient.connect(url, function (err, database) {
  console.log("Connected correctly to server");
  db = database;
});

app.use(bodyparser.json());
app.use(express.static('public'));

var insertDocument = function (db, document, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(document, function (err, result) {
    callback(err, JSON.stringify(result.ops[0]));
  });
};

// eg,  echo '{"name": "PDMLab"}' | curl -d @- http://localhost:3000/hello
app.post('/hello', function (req, res) {
  var data = req.body;
  insertDocument(db, data, function (err, result) {
    res.status(201).send(result);
  });
});

app.get('/hello', function (req, res) {
  res.send('world');
});

app.listen(3000);
