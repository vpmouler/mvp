const React = require('react');
const ReactDOM = require('react-dom');

const YelpRender = (props) => {
  var randomNum = Math.floor(Math.random() * props.allData.length);
  var foundBusiness = props.allData[randomNum];
  console.log('image in yelp render',foundBusiness.image_url, typeof foundBusiness.image_url )
  return (
    <div>
      <button onClick={() => props.favoriteRestaurant(foundBusiness)} > Favorite this restuarant </button> <br/>
      <h1 onClick={props.callbackFav}> {foundBusiness.name} </h1>
      <span> {foundBusiness.rating} </span> <br/>
      <span> {foundBusiness.price} </span> <br/>
      <span> {foundBusiness.display_phone} </span> <br/>
      <img src={foundBusiness.image_url} /> <br/>
    </div>
  )
};

module.exports = YelpRender;