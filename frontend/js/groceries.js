import axios from 'axios';
import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import caretUp from '../images/up-chevron.png';
import caretDown from '../images/down-chevron.png';

class Groceries extends Component {
  constructor(props) {
    super(props);
    this.state = {groceryList: {}}
    this.loadGroceryList();
  }

  loadGroceryList() {
    axios.get('/grocery-list').then(function(response) {
      this.setState({groceryList: response.data});
      console.log(this.state.groceryList);
    }.bind(this));
  }

  render() {
    return (
      <div className="groceryListContainer">
        {Object.keys(this.state.groceryList).map(category => (
          <Collapsible trigger={
              <div className="groceryCategoryText">
                  <div style={{margin: "0 auto", width: 200, left: 15, position: "relative"}}>
                    {category}<img src={caretUp} className="groceryCategoryExpandIcon caretUp"/>
                    <img src={caretDown} className="groceryCategoryExpandIcon caretDown"/>
                  </div>
              </div>
            } triggerClassName="groceryCategoryContainer">
            {this.state.groceryList[category].map(ingredient => (
              <div style={{textAlign: "center"}}>
                <p>{ingredient.display_amount + ' ' + ingredient.unit + ' ' + ingredient.name}</p>
              </div>
            ))}
          </Collapsible>
        ))}
      </div>
    );
  }
}

export default Groceries;
