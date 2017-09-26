// import React from 'react'
// import ReactDOM from
import {BrowserRouter as Router, Link} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


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
      firstVisit: true,
      finishedZip: false,
      arrayOfClicked: null,
      zipcodeEntered: null // ensure this is 5 digits and numeric otherise alert
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
    console.log('i was clicked ajax')
    this.setState({
      clickedFind: true
    });
    $.ajax({
      url: '/getme',
      type: 'GET',
      data: {test:'sevaIsMe'},
      contentType: 'application/json',
      headers: {
        "My-First-Header":"first value",
        "My-Second-Header":"second value"
      },
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
      this.setState({
        zipcodeEntered: e.target.value,
        firstVisit: false
      })
    }
  }

  handleAI(arr) {
    // set state to finished zip true
    // pass down button
    console.log('first',arr)
    this.setState({
      finishedZip: true,
      arrayOfClicked: arr
    });
    console.log(arr)
    console.log('in state',this.state.arrayOfClicked)
  }

  render() {
    if (this.state.firstVisit) {
      return (
        <div>
          Hello World First Time!
          <ZipCode handleKeyPress={this.handleKeyPress.bind(this)} />
        </div>
      )
    } else if (!this.state.finishedZip) {
      return (
        <div>
          <GridListExampleSingleLine handleAI={this.handleAI.bind(this)} />
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
          <CardExampleWithAvatar callbackFav={this.callbackFavorited.bind(this)} favoriteRestaurant={this.favoriteRestaurant} allData={this.state.yelpData.businesses} />
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
  <div style={{
    margin: `auto`,
    width: `50%`}}>
    <MuiThemeProvider>
       <TextField
        id="text-field-controlled"
        onKeyPress={props.handleKeyPress}
        hintText="Enter your zip code to get started!"
      />
    </MuiThemeProvider>
    <br/>
  </div>
);

const CardExampleWithAvatar = (props) => {
  var randomNum = Math.floor(Math.random() * props.allData.length);
  var foundBusiness = props.allData[randomNum];
  return (
    <MuiThemeProvider>
      <Card>
        <CardHeader
          title={foundBusiness.name}
          subtitle="Here's a recommendation based on your tastes"
          avatar={foundBusiness.image_url}
        />
        <CardMedia
          overlay={<CardTitle title={foundBusiness.name} subtitle={foundBusiness.rating + ` stars!`} />}
        >
          <img src={foundBusiness.image_url} alt="" />
        </CardMedia>
        <CardTitle title="The restuarant in a few words" subtitle={foundBusiness.display_phone} />
        <CardText>
          Put description of restuarant here {foundBusiness.price}
        </CardText>
        <CardActions>
          <FlatButton label="Favorite this restuarant" onClick={() => props.favoriteRestaurant(foundBusiness)} />
        </CardActions>
      </Card>
    </MuiThemeProvider>
  )
};

const GridListExampleSingleLine = (props) => {
  var arrayOfClicked = [];
  return (
    <div>
      <MuiThemeProvider>
        <div style={styles.root}>
          <GridList style={styles.gridList} cols={2.2}>
            {tilesData.map((tile) => (
              <GridTile
                key={tile.img}
                title={tile.title}
                actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
                titleStyle={styles.titleStyle}
                titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                onClick={() => arrayOfClicked.push(tile)}
              >
                <img src={tile.img} />
              </GridTile>
            ))}
          </GridList>
        </div>
      </MuiThemeProvider>
      <div style={{margin: `auto`}}>
        <MuiThemeProvider>
          <RaisedButton label="Next!" onClick={() => props.handleAI(arrayOfClicked)}/>
        </MuiThemeProvider>
      </div>
    </div>
  )
};

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(5, 188, 212)',
  },
};

const tilesData = [
  {
    img: 'https://s3-media4.fl.yelpcdn.com/bphoto/ctrC3VYSLnUBqOwihkYmeQ/o.jpg',
    title: 'Dessert'
  },
  {
    img: 'https://s3-media1.fl.yelpcdn.com/bphoto/8zsuuFU840owv_Nt5qFKwg/o.jpg',
    title: 'Healthy'
    // daily helth food center
  },
  {
    img: 'https://s3-media3.fl.yelpcdn.com/bphoto/ose-rlo_a7c6pybjIxjHbA/o.jpg',
    title: 'Japanese'
    //Shizen Vegan Sushi Bar & Izakaya
  },
  {
    img: 'https://s3-media2.fl.yelpcdn.com/bphoto/iwutElltXjmQSxySFSJRUQ/o.jpg',
    title: 'Breakfasty'
    //oasis cafe
  },
  {
    img: 'https://s3-media1.fl.yelpcdn.com/bphoto/loPhWvr0lmgB1G7lkP2D5Q/o.jpg',
    title: 'South East Asian',
    author: 'Hans'
    // Little Vietnam Cafe
  }
];













const Button = (props) => (
  <button onClick={props.clickedMe}> Search </button>
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


