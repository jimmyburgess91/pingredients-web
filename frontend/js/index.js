import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import 'rc-tabs/assets/index.css';
import SwipeableInkTabBar from 'rc-tabs/lib/SwipeableInkTabBar';
import '../css/index.css';
import groceriesTab from '../images/groceries-25.png';
import makingTab from '../images/fry-tab.png';
import pingredientsTab from '../images/pingredients-24.png';
import Recipes from 'recipes';
import Login from 'login';




class Pingredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null
    }
    this.authCallback = this.authCallback.bind(this);
  }

  authCallback(token, userId) {
    this.setState({
      token: token,
      userId: userId
    });
  }

  render() {
    if (!(this.state.token)) {
      return (
        <Login authCallback={this.authCallback}/>
      )
    }

    return (
      <Tabs
        defaultActiveKey="recipes"
        renderTabBar={()=><SwipeableInkTabBar style={{height: 60, marginBottom: 10}} pageSize={3}/>}
        renderTabContent={()=><TabContent/>}
      >
        <TabPane tab={<div className="tabBarItem"><img src={pingredientsTab}/><p>Recipes</p></div>} key="recipes">
          <Recipes userId={this.state.userId} token={this.state.token}/>
        </TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={makingTab}/><p>Making</p></div>} key="making">
          Second
        </TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={groceriesTab}/><p>Groceries</p></div>} key="groceries">
          third
        </TabPane>
      </Tabs>
    );
  }
}


ReactDOM.render(
  <Pingredients />,
  document.getElementById('root')
);
