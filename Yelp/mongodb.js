const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/yelpone';

const collection = 'yelpone'
// unique columns
const save = function(data) {
  mongoClient.connect(url, (err, db) => {
    db.createCollection(collection, (err, collection) => {
      collection.insert(data);
    })
  })
};

const find = function(callback) {
  mongoClient.connect(url, (err, db) => {
    db.collection(collection, (err, collection) => {
      collection.find().toArray((err, items) => {
        callback(JSON.stringify(items));
      })
    })
  })
};

module.exports.find = find;
module.exports.save = save;