//import 'core-js/stable';
//import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

//if (module.hot) {
//  module.hot.accept();
//}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1.updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2.Loading Recipe
    await model.loadRecipe(id);

    //3.Rendering Recipe
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

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2.update recipe view
  recipeView.update(model.state.recipe);
  //3. render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
