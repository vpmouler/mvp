const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp');

let yelpSchema = mongoose.Schema({
  restaurantName: String,
  restaurantId: {type: Number,unique:true},
  restaurantImage: String,
  restaurantRating: Number,
  restaurantPrice: String,
  restaurantPhone: String,
});

let FavRestaurants = mongoose.model('FavRestaurants', yelpSchema);

let save = (data) => {

  // get data from API call
  // use data.username to make new repo
  var newFavorite = new FavRestaurants({
    restaurantName: data.restaurantName,
    restaurantId: data.restaurantId,
    restaurantImage: data.restaurantImage,
    restaurantRating: data.restaurantRating,
    restaurantPrice: data.restaurantPrice,
    restaurantPhone: data.restaurantPhone
  });
  console.log('saved!')
  newFavorite.save();//(err) => {if (err) throw 'Could not save to DB';}).catch((err) => console.log('buttkins'));
};

let find = (callback) => {
  return FavRestaurants.find(); //({stars:{$gt:0}}).sort({stars:-1})//.exec((err,data) => {
  //   if (err) {
  //     throw 'Could not fetch top 25'
  //   } else {
  //     // callback(JSON.stringify(data))
  //     callback(null,data)
  //   }
  // })
};


// Repo.update({
//   '_id.repoId':123,
//   username:'sevayay',
//   description:'butthole',
//   url:'hi'
// },{upsert:true})

module.exports.find = find;
module.exports.save = save;

// save({username: 'seva', id: 6969})