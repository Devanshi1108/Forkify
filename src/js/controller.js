//to support old browsers:polyfilling
//npm i core-js regenerator-runtime
import 'core-js/stable';
import 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

//Documentation:  https://forkify-api.jonas.io
//Get recipie based on id: https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886
//Search for recipie based on keywords: https://forkify-api.jonas.io/api/v2/recipes?search=pizza

///////////////////////////////////////
////publisher-subscriber pattern

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    //Fetch id from the URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    //resultsView to mark selected search result
    resultsView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);

    //Load the recipe
    await model.loadRecipe(id);

    //Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();

    //get query from search bar
    const query = searchView.getQuery();
    if (!query) return;

    //Load the search result
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultPage(1));

    //Render the initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goto) {
  //render new results
  resultsView.render(model.getSearchResultPage(goto));
  //Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  //update the recipie servings (in state)
  model.updateServings(newServing);

  //update the recipieView
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (model.state.recipe.bookmarked === false) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarksView
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderSuccessMsg();
    //render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //change id in the URL (state,title,url)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
