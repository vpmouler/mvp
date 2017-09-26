// import React from 'react'
// import ReactDOM from
import {BrowserRouter as Router, Link} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const YelpRender = require('./YelpRender');


class App extends React.Component{
  constructor() {
    super();
    this.state = {
      isToggleOn: true,
      yelpData: null,
      previousFavs: false,
      clickedFind: false,
      clickedSearch: false,
      firstVisit: true
    };
    this.favoriteRestaurant = this.favoriteRestaurant.bind(this)
  }

  // make a component did mount to show previously found ones - will be a get req to another route
  // store that prev found data on mongo
  // component did mount will GET from server, which will get from mongo

  // add button to favorite, store that on db

  componentDidMount() {
    console.log(this.state.clickedFind)
    console.log('componentWillMount')
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

  callbackFavorited (e) {
    console.log('in the callback!',e);  
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

  handleSearchClick() {
    this.setState({
      clickedSearch: !this.state.clickedSearch
    })
  }

  handleClick() {
    this.setState({
      clickedFind: true
    });
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

  // on init show a few restaurants, make super class
  // choose whichu like, ur zip and price range

  // output one at a time, chang ebutton to next upon being lciked once.

  // html/css drag drop templates or the handler thing

  // redux

  // google: "pass up state/variables from child props [to parent]"

  // later can add reviews

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      console.log(e.value)
    }
  }

  render() {
    if (this.state.firstVisit) {
      return (
        <div>
          Hello World First Time!
          <ZipCode handleKeyPress={this.handleKeyPress.bind(this)} />
        </div>
      )
    } else if (this.state.previousFavs && !this.state.clickedFind) {
      console.log('inside prev favs render')
      return (
        <div>
          <br />
          <div> Find A Restaurant! </div>
          <Button clickedState={this.state.clickedSearch} clickedMe={this.handleClick.bind(this)} /> <br/>
          <PreviousFavs previousFavs={this.state.previousFavs} />
          <div> {this.state.previousFavs ? 'You Have None!' : 'These Are Your Favs!'} </div>
        </div>
      )
    } else if (this.state.yelpData) {
      console.log('inside if')
      return (
        <div>
          <br />
          <div> We found a restuarant for you! </div>
          <Button clickedState={this.state.isToggleOn} clickedMe={this.handleClick.bind(this)} />
          <YelpRender callbackFav={this.callbackFavorited.bind(this)} favoriteRestaurant={this.favoriteRestaurant} allData={this.state.yelpData.businesses} />
        </div>
      )
    } 
    else {
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

const ZipCode = (props) => (
  <div>
    <MuiThemeProvider>
       <TextField
        id="text-field-controlled"
        onKeyPress={props.handleKeyPress}
        hintText="Enter your zip code to get started!"
      />
    </MuiThemeProvider>
    <MuiThemeProvider>
      <RaisedButton label="Go!" onClick={() => alert('boom')}/>
    </MuiThemeProvider>
  </div>
)






/*
class TestInput extends React.Component {

handleKeyPress(target) {
    if(target.charCode==13){
            alert('Enter clicked!!!');    
    }

}

render() {
  return (
    <Input type="text" onKeyPress={this.handleKeyPress} />
  );
 }
}
*/


















const Button = (props) => (
  <button onClick={props.clickedMe}> {props.clickedState ? 'Search' : 'Found One!'}</button>
);

const PreviousFavs = (props) => {
  return (
    <div>
      <h2> Previously Favorited Restaurants </h2>
      {
        props.previousFavs.businesses.map((restuarant, i) => {
          return (
            <div key={i}>
              <h3> {restuarant.restaurantName} </h3>
              <span> {restuarant.restaurantRating} </span>
              <span> {restuarant.restaurantPrice} </span> <br/>
              <span> {restuarant.restaurantPhone} </span> <br/>
              <img src={restuarant.restaurantImage} /> <br/>
            </div>
          )
        })
      }
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))


