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
import Groceries from 'groceries';




class Pingredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null,
      activeTab: "recipes",
      lastUnmakeId: null
    }
    this.authCallback = this.authCallback.bind(this);
    this.unmakeCallback = this.unmakeCallback.bind(this);
    this.tabChange = this.tabChange.bind(this);
  }

  authCallback(token, userId) {
    this.setState({
      token: token,
      userId: userId
    });
  }

  unmakeCallback(recipeId) {
    this.setState({lastUnmakeId: recipeId});
  }

  tabChange(key) {
    this.setState({activeTab: key});
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
        onChange={this.tabChange}
        renderTabBar={()=><SwipeableInkTabBar style={{height: 60, top: 0, position: "fixed", width:"100%", zIndex: 999, backgroundColor: "rgb(249, 249, 249)"}} pageSize={3}/>}
        renderTabContent={()=><TabContent style={{marginTop: 70}}/>}
      >
        <TabPane tab={<div className="tabBarItem"><img src={pingredientsTab}/><p>Recipes</p></div>} key="recipes">
          <Recipes
            userId={this.state.userId}
            token={this.state.token}
            lastUnmakeId={this.state.lastUnmakeId}
          />
        </TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={makingTab}/><p>Making</p></div>} key="making">
          <Recipes
            userId={this.state.userId}
            token={this.state.token}
            makingOnly={true}
            activeTab={this.state.activeTab}
            unmakeCallback={this.unmakeCallback}
          />
        </TabPane>
        <TabPane tab={<div className="tabBarItem"><img src={groceriesTab}/><p>Groceries</p></div>} key="groceries">
          <Groceries activeTab={this.state.activeTab}/>
        </TabPane>
      </Tabs>
    );
  }
}


ReactDOM.render(
  <Pingredients />,
  document.getElementById('root')
);
