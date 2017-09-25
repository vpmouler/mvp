var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/yelpone';
mongoClient.connect(url, function(err, db) {
  console.log('Connected to MongoDB!');
  db.createCollection('yelpone', function(err, collection) {
    console.log('Created collection');
    var testDocument = {
      name: 'Jean Valjean',
      password: '24601'
    };
    collection.insert(testDocument, function(err, docs) {
      console.log('Inserted a document.');
      collection.count(function(err, count) {
        console.log('This collection contains ' + count + ' documents.');
      });
      collection.find().toArray(function(err, documents) {
        documents.forEach(function(document) {
          console.log('Found a document with name = ' + document.name);
        });
        db.close();
        console.log('Closed the connection!');
      });
    });
  });
});