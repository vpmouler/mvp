const express = require('express');
const app = express();
const rp = require('request-promise');
const bodyparser = require('body-parser')
const Yelp = require('yelp-api-v3');
// const db = require('./mongo');
const mongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');

const apiKey = require('./yelp_api_keys');

const mongoDB = require('./mongodb');

const yelp = new Yelp({
  app_id: apiKey.app_id,
  app_secret: apiKey.app_secret
});

app.use('/start', express.static('./app/pages')) // using express as router
app.use('/', express.static('./build'))

app.use(bodyparser.json());

app.get('/getme', (req, res) => {
  console.log(req.query.zipCode)
  console.log(req.query.preferences)
  // loop through .preferences, get .title for each and concat to title+title
  var searchQuery;
  if (req.query.preferences) {
    searchQuery = req.query.preferences.reduce((acc, start) => {
      return start.title+='+'+acc;
    }, '').slice(0,-1);
  }

  yelp.search({term: searchQuery || 'icecream', location: req.query.zipCode || '94102', price: '1,2,3', limit: 20})
    .then(function (data) {
      console.log(data)
        res.send(data);
    })
    .catch(function (err) {
        console.error(err);
  });
});




app.post('/getme', (req, res) => {
  console.log('this is the POST request')
  var testDocument = {
    restaurantName: req.body.data.name,
    restaurantId: req.body.data.id,
    restaurantImage: req.body.data.image_url,
    restaurantRating: req.body.data.rating,
    restaurantPrice: req.body.data.price,
    restaurantPhone: req.body.data.display_phone
  };


  var url = 'mongodb://localhost:27017/yelpone';
  mongoClient.connect(url, function(err, db) {
    console.log('Connected to MongoDB!');
    db.createCollection('yelpone', function(err, collection) {
      console.log('Created collection');

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

  // console.log(favRestObj)
  // db.save(favRestObj);

  res.send(JSON.stringify({name:'seva'}))
});

app.get('/refresh', (req, res) => {
  console.log('in refresh');
  var url = 'mongodb://localhost:27017/yelpone';

  // mongoDB.find(() => res.send()); //try res.json and no stringifiy in mongodb.js

  mongoClient.connect(url, function(err, db) {
    db.collection('yelpone', function(err, collection) {

      collection.find().toArray((err, items) => {
        res.send(JSON.stringify(items));
      })
    })
  })
});

 // MODULARIZE AND HOW TO DO $LT

const port = 1337;

app.listen(port, () => {
  console.log(`Listening on ${port}!`)
});

// TODO:
// refactor DB so can just pass in entire req.body
// why cant use on fetch?
// make favorite button work correctly
// refactor to expor to other files on client n sever
// make a new route for get from client upon component did mount, and use db.find