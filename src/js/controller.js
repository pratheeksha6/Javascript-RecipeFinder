//import 'core-js/stable';
//import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //1.Loading Recipe
    await model.loadRecipe(id);

    //2.Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1.Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2.load search results
    await model.loadSearchResults('pizza');

    //3.render results
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4.render initial pagination buttons
    paginationView.render(model.state.search);
    //resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1.render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2.render NEW pagination buttons
  paginationView.render(model.state.search);
  console.log('goToPage');
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
