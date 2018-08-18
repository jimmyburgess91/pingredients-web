import axios from 'axios';
import React, { Component } from 'react';
import pingredientsLogo from '../images/pingredients-120.png'


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (DEV) {
      let token="dev_token";
      let userId = "dev_user_id"
      axios.defaults.headers.common["oauth_token"] = token;
      axios.defaults.headers.common["user_id"] = userId;
      axios.put('/users/' + userId).then(function(response) {
        this.props.authCallback(token, userId);
        this.state = {token: token};
      }.bind(this));
    } else {
      PDK.init({
          appId: "4945793189364646595",
          cookie: true
      });
      let session = PDK.getSession();
      if (session) {
        this.state = {token: session.accessToken};
        this.createOrGetUser(session.accessToken);
      } else {
        this.state = {token: null};
      }
    }

    this.login = this.login.bind(this);
    this.createOrGetUser = this.createOrGetUser.bind(this);
  }

  login() {
    PDK.login({scope: "read_public"}, function(response) {
      this.createOrGetUser(response.session.accessToken);
    }.bind(this));
  }

  createOrGetUser(token) {
    PDK.me({}, function(response) {
      axios.put('/users/' + response.data.id, {}, {headers: {"oauth_token": token}}).then(function(r) {
        axios.defaults.headers.common["oauth_token"] = token;
        axios.defaults.headers.common["user_id"] = response.data.id;
        this.props.authCallback(token, response.data.id);
      }.bind(this));
    }.bind(this));
  }

  render() {
    if (this.state.token) {
      return null;
    }
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
    );
  }
}

export default Login;
