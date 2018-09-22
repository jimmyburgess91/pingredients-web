import axios from 'axios';
import React, { Component } from 'react';
import {isMobile, isTablet} from 'react-device-detect';
import StackGrid, { transitions, easings } from 'react-stack-grid';
import Waypoint from 'react-waypoint';
import makingButton from  '../images/fry-6.png';

const transition = transitions.scaleDown;
const darkGrey = "#555555";
const jungleGreen = "#00ca80";


class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: window.innerHeight,
      token: props.token,
      userId: props.userId,
      recipes: [],
      cursor: "default"
    };

    this.getScreenDimensions = this.getScreenDimensions.bind(this);
    this.getColuDimensions = this.getColumnDimensions.bind(this);
    this.loadRecipes = this.loadRecipes.bind(this);
    this.toggleMaking = this.toggleMaking.bind(this);
  }

  componentDidMount() {
    this.loadRecipes();
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeTab == "making" && prevProps.activeTab != "making") {
      this.loadRecipes();
    }

    if (!this.props.makingOnly && this.props.lastUnmakeId != prevProps.lastUnmakeId) {
      let recipeId = this.props.lastUnmakeId;
      let recipes = this.state.recipes;
      recipes.find(function(r) { return r.id == recipeId; }).making = false;
      this.setState({recipes: recipes});
    }
  }

  loadRecipes() {
    if (!this.state.cursor && !this.props.makingOnly) {
      return
    }
    if (this.state.isLoading) {
      return;
    }
    this.setState({isLoading: true});
    let url = '';
    if (!this.props.makingOnly) {
      url = '/recipes';
      if (this.state.cursor != "default") {
        url += '?cursor=' + this.state.cursor;
      }
    } else {
      url = '/making-recipes';
    }
    axios.get(url).then(function(response) {
      let recipes = [];
      if (this.props.makingOnly) {
        recipes = response.data.data;
      } else {
        recipes = this.state.recipes.concat(response.data.data);
      }
      this.setState({
        recipes: recipes,
        cursor: response.data.cursor,
        isLoading: false
      });
    }.bind(this));
  }

  toggleMaking(recipe, index) {
    let making = recipe.making;

    let recipes = this.state.recipes;
    recipes[index].making = !recipe.making;
    recipes[index].loading = true;
    this.setState({recipes: recipes});

    if (making) {
      axios.delete('/making-recipes/' + recipe.id).then(function(response) {
        let recipes = this.state.recipes;
        recipes[index].loading = false;

        if (this.props.makingOnly) {
          this.props.unmakeCallback(recipes[index].id);
          recipes.splice(index, 1);
        }

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

  getScreenDimensions() {
    this.setState({
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: window.innerHeight
    });
  }

  getColumnDimensions(screenWidth, screenHeight) {
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

  render() {
    document.body.classList.remove("loginBackground");

    if (!this.state.recipes.length) {
      if (this.props.makingOnly) {
        return (
          <div style={{textAlign: "center"}}>
            Click the frying pan button on some recipes on the recipes tab to get started
          </div>
        );
      } else {
        return (
          <div style={{textAlign: "center"}}>
            Pin some recipes on pinterest to get started
          </div>
        );
      }
    }

    window.onload = this.getScreenDimensions;
    window.onresize = this.getScreenDimensions;
    let columnDimensions = this.getColumnDimensions(this.state.screenWidth, this.state.screenHeight);
    return (
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
            <img src={recipe.image.original.url} style={{height: recipe.image.original.height / (recipe.image.original.width / columnDimensions.columnWidth)}}/>
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
        {!this.props.makingOnly &&
          <Waypoint
            key={this.state.cursor}
            onEnter={this.loadRecipes}
          />
        }
      </StackGrid>
    );
  }
}

export default Recipes;
