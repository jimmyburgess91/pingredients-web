/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {isMobile, isTablet} from 'react-device-detect';
import StackGrid, { transitions, easings } from 'react-stack-grid';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import 'rc-tabs/assets/index.css';
import SwipeableInkTabBar from 'rc-tabs/lib/SwipeableInkTabBar';
import Waypoint from 'react-waypoint';
import '../css/index.css';
import makingButton from  '../images/fry-6.png';
import groceriesTab from '../images/groceries-25.png';
import makingTab from '../images/fry-tab.png';
import pingredientsTab from '../images/pingredients-24.png';
import pingredientsLogo from '../images/pingredients-120.png'



const transition = transitions.scaleDown;
const darkGrey = "#555555";
const jungleGreen = "#00ca80";

function getColumnDimensions(screenWidth, screenHeight) {
  let isLandscape = (screenWidth > screenHeight) && isMobile;
  let columns = 5;
  let gutter = 24;
  if (!isMobile) {
    return {columnWidth: 236, gutter: gutter};
  } else {
    gutter = 15;
    if (isLandscape) {
      columns = 3;
    } else {
      columns = 2;
    }
    if (isTablet) {
      columns++;
    }
    return ({
        columnWidth: ((screenWidth - ((columns + 1) * gutter)) / columns),
        gutter: gutter
    });
  }
}

class Recipes extends Component {
  constructor(props) {
    super(props);
    PDK.init({
        appId: "4945793189364646595",
        cookie: true
    });
    let token = "";
    if (DEV) {
      token="dev_token";
    } else {
      let session = PDK.getSession();
      if (session) {
        token = session.accessToken;
      }
      this.createOrGetUser();
    }

    this.state = {
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: window.innerHeight,
      token: token,
      recipes: [],
      cursor: "default"
    };
    if (DEV) {
      this.state.userId = "dev_user_id";
      axios.defaults.headers.common["oauth_token"] = this.state.token;
      axios.defaults.headers.common["user_id"] = this.state.userId;
      axios.put('/users/' + this.state.userId).then(function(response) {
        this.loadRecipes();
      }.bind(this));
    }
    this.getScreenDimensions = this.getScreenDimensions.bind(this);
    this.login = this.login.bind(this);
    this.createOrGetUser = this.createOrGetUser.bind(this);
    this.loadRecipes = this.loadRecipes.bind(this);
    this.toggleMaking = this.toggleMaking.bind(this);
  }

  createOrGetUser() {
    PDK.me({}, function(response) {
      this.setState({userId: response.data.id});
      axios.put('/users/' + response.data.id, {}, {headers: {"oauth_token": this.state.token}});
      axios.defaults.headers.common["oauth_token"] = this.state.token;
      axios.defaults.headers.common["user_id"] = this.state.userId;
      this.loadRecipes();
    }.bind(this));
  }

  login() {
    PDK.login({scope: "read_public"}, function(response) {
      this.setState({token: response.session.accessToken});
      this.createOrGetUser();
    }.bind(this));
  }

  getScreenDimensions() {
    this.setState({
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: window.innerHeight
    });
  }

  loadRecipes() {
    if (!this.state.cursor) {
      return
    }
    if (this.state.isLoading) {
      return;
    }
    this.setState({isLoading: true});
    let url = '/recipes';
    if (this.state.cursor != "default") {
      url += '?cursor=' + this.state.cursor;
    }
    axios.get(url).then(function(response) {
      this.setState({
        recipes: this.state.recipes.concat(response.data.data),
        cursor: response.data.cursor,
        isLoading: false
      });
    }.bind(this));
  }

  toggleMaking(recipe, index) {
    let recipes = this.state.recipes;
    recipes[index].making = !recipe.making;
    recipes[index].loading = true;
    this.setState({recipes: recipes});
    if (recipe.making) {
      axios.delete('/making-recipes/' + recipe.id).then(function(response) {
        let recipes = this.state.recipes;
        recipes[index].loading = false;
        this.setState({recipes: recipes});
      }.bind(this));
    } else {
      axios.post('/making-recipes', recipe).then(function(response) {
        let recipes = this.state.recipes;
        recipes[index].loading = false;
        this.setState({recipes: recipes});
      }.bind(this));;
    }

  }

  render() {
    if (this.state.token && !(this.state.userId && this.state.recipes)) {
      return null;
    }
    if (!(this.state.token)) {
      document.body.classList.add('loginBackground');
      return (
        <div className="loginCard">
          <div style={{minHeight: 400, padding: "20px 10px"}}>
            <img className="pingredientsLogo" src={pingredientsLogo}/>
            <div className="loginTextContainer">
              <h3 style={{fontSize: 32, fontWeight: "bold", WebkitFontSmoothing: "antialiased", letterSpacing: -1.2}}>
                Plan your favorite recipes
              </h3>
            </div>
            <div className="loginTextContainer">
              <h3 style={{textAlign: "center", fontSize: 16, fontWeight: "normal", margin: "-15px 0px 20px"}}>
                Create grocery lists from your favorite recipes on pinterest
              </h3>
            </div>
            <button onClick={this.login} className="loginButton">
              Login with Pinterest
              <svg height="30" viewBox="-3 -3 82 82" width="30" style={{display: "block", float: "left"}}>
                <circle cx="38" cy="38" fill="white" r="40"></circle>
                <path d="M27.5 71c3.3 1 6.7 1.6 10.3 1.6C57 72.6 72.6 57 72.6 37.8 72.6 18.6 57 3 37.8 3 18.6 3 3 18.6 3 37.8c0 14.8 9.3 27.5 22.4 32.5-.3-2.7-.6-7.2 0-10.3l4-17.2s-1-2-1-5.2c0-4.8 3-8.4 6.4-8.4 3 0 4.4 2.2 4.4 5 0 3-2 7.3-3 11.4C35.6 49 38 52 41.5 52c6.2 0 11-6.6 11-16 0-8.3-6-14-14.6-14-9.8 0-15.6 7.3-15.6 15 0 3 1 6 2.6 8 .3.2.3.5.2 1l-1 3.8c0 .6-.4.8-1 .4-4.4-2-7-8.3-7-13.4 0-11 7.8-21 22.8-21 12 0 21.3 8.6 21.3 20 0 12-7.4 21.6-18 21.6-3.4 0-6.7-1.8-7.8-4L32 61.7c-.8 3-3 7-4.5 9.4z" fill="#BD081C" fillRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      )
    }
    document.body.classList.remove("loginBackground");
    window.onload = this.getScreenDimensions;
    window.onresize = this.getScreenDimensions;
    let columnDimensions = getColumnDimensions(this.state.screenWidth, this.state.screenHeight);
    return (
      <Tabs
        defaultActiveKey="1"
        renderTabBar={()=><SwipeableInkTabBar style={{height: 60, marginBottom: 10}} pageSize={3}/>}
        renderTabContent={()=><TabContent/>}
      >
        <TabPane tab={<div className="tabBarItem"><img src={pingredientsTab}/><p>Recipes</p></div>} key="recipes">
          <StackGrid
            monitorImagesLoaded
            columnWidth={columnDimensions.columnWidth}
            duration={600}
            gutterWidth={columnDimensions.gutter}
            gutterHeight={columnDimensions.gutter}
            appearDelay={60}
            appear={transition.appear}
            appeared={transition.appeared}
            enter={transition.enter}
            entered={transition.entered}
            leaved={transition.leaved}
          >
            {this.state.recipes.map((recipe, index) => (
              <figure
                key={recipe.id}
                className="image"
              >
                <img src={recipe.image.original.url}/>
                <figcaption>{recipe.metadata.recipe.name}</figcaption>
                <button
                  className="makingButton"
                  style={{backgroundColor: recipe.making ? jungleGreen : darkGrey}}
                  disabled={recipe.loading}
                  ref={btn => { this.btn = btn; }}
                  onClick={() => this.toggleMaking(recipe, index)}
                >
                  <img src={makingButton}/>
                </button>
              </figure>
            ))}
            <Waypoint
              key={this.state.cursor}
              onEnter={this.loadRecipes}
            />
          </StackGrid>
        </TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={makingTab}/><p>Making</p></div>} key="making">second</TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={groceriesTab}/><p>Groceries</p></div>} key="groceries">third</TabPane>
      </Tabs>
    );
  }
}


ReactDOM.render(
  <Recipes />,
  document.getElementById('root')
);
