// import React from 'react'
// import ReactDOM from 

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

class App extends React.Component{
  constructor() {
    super();
    this.state = {
      isToggleOn: true,
      yelpData: null,
      previousFavs: null
    };
    this.favoriteRestaurant = this.favoriteRestaurant.bind(this)
  }

  // make a component did mount to show previously found ones - will be a get req to another route
  // store that prev found data on mongo
  // component did mount will GET from server, which will get from mongo

  // add button to favorite, store that on db

  componentDidMount() {
    $.ajax({
      url: '/refresh',
      type: 'GET',
      success: (data) => {
        console.log('success in GET Refresh', JSON.parse(data))
        this.setState({
          previousFavs: {businesses:JSON.parse(data)}
        })
      },
      error: (err) => {
        console.log('error in GET Refresh', err);
      }
    })
  }

  favoriteRestaurant (restuarant) {
    console.log('favorited', restuarant);
    // fetch(`/getme`, {
    //   method:'POST',
    //   data: JSON.stringify({restuarant:restuarant}),
    //   contentType: 'application/json'
    // }).then(data => console.log('successful POST', data.json()))
    $.ajax({
      url: '/getme',
      type: 'POST',
      data: JSON.stringify({data:restuarant}),
      contentType: 'application/json',
      success: (data) => {
        console.log('success on POST', JSON.parse(data));
      },
      error: (err) => {
        console.log('error on POST', err);
      }
    })
  }

  handleClick() {
    $.ajax({
      url: '/getme',
      type: 'GET',
      success: (data) => {
        this.setState({
          yelpData: JSON.parse(data) // refactor to get random one from server instead of passing along all
        })
        console.log('success')
      },
      error: (err) => {
        console.log('error', err);
      }
    })
  }

  // loop thru get on /refresh w/ .map
  // these are prev saved restaurants
  // change prop names so it shows up

  // on init show a few restaurants, make super class
  // choose whichu like, ur zip and price range

  // output one at a time, chang ebutton to next upon being lciked once.

  // html/css drag drop templates or the handler thing

  // redux

  // google: "pass up state/variables from child props [to parent]"

  // later can add reviews

  render() {
    // set if this.state.yelpData is true, render something else
    // use .map?? study regardless, maybe refactor to show all?
    // if (this.state.getData) {
    //   console.log('inside getData if');
    //   return (
    //     <div>
    //       <br />
    //       <div> We found a restuarant for you! </div>
    //       <Button clickedState={this.state.isToggleOn} clickedMe={this.handleClick.bind(this)} />
    //       <YelpRender favoriteRestaurant={this.favoriteRestaurant} allData={this.state.yelpData.businesses} />
    //     </div>
    //   )
    // } 

    if (this.state.previousFavs) {
      console.log('inside prev favs render')
      return (
        <div>
          <br />
          <div> These are your previoulsy favorited restaurants </div>
          <Button clickedState={this.state.isToggleOn} clickedMe={this.handleClick.bind(this)} />
          <PreviousFavs previousFavs={this.state.previousFavs} />
        </div>
      )
    }
    else if (this.state.yelpData) {
      console.log('inside if')
      return (
        <div>
          <br />
          <div> We found a restuarant for you! </div>
          <Button clickedState={this.state.isToggleOn} clickedMe={this.handleClick.bind(this)} />
          <YelpRender favoriteRestaurant={this.favoriteRestaurant} allData={this.state.yelpData.businesses} />
        </div>
      )
    } else {
      console.log('inside else')
      return (
        <div>
          <br />
          <div> Find A Restaurant! </div>
          <Button clickedState={this.state.isToggleOn} clickedMe={this.handleClick.bind(this)} />
        </div>
      )
    }
  }

};


const Button = (props) => (
  <button onClick={props.clickedMe}> {props.clickedState ? 'Search' : 'Found One!'}</button>
)

const PreviousFavs = (props) => {
  // props.previousFavs.businesses.map(restuarant => {
  //   return (<div> hi </div>)
  // })
  console.log('image in prev favs',props.previousFavs.businesses[0].restuarantImage, typeof props.previousFavs.businesses[0].restuarantImage )
  return (
    <div>
      <h2> Previously Favorited Restaurants </h2>
      <h3> {props.previousFavs.businesses[0].restaurantName} </h3>
      <span> {props.previousFavs.businesses[0].restaurantRating} </span>
      <span> {props.previousFavs.businesses[0].restaurantPrice} </span> <br/>
      <span> {props.previousFavs.businesses[0].restaurantPhone} </span> <br/>
      <img src={props.previousFavs.businesses[0].restaurantImage} /> <br/>
    </div> 
  )
}

const YelpRender = (props) => {
  var randomNum = Math.floor(Math.random() * props.allData.length);
  var foundBusiness = props.allData[randomNum];
  console.log('image in yelp render',foundBusiness.image_url, typeof foundBusiness.image_url )
  return (
    <div>
      <button onClick={props.favoriteRestaurant(foundBusiness)} > Favorite this restuarant </button> <br/>
      <h1> {foundBusiness.name} </h1>
      <span> {foundBusiness.rating} </span> <br/>
      <span> {foundBusiness.price} </span> <br/>
      <span> {foundBusiness.display_phone} </span> <br/>
      <img src={foundBusiness.image_url} /> <br/>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('app'))


