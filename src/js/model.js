import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //only if key exits add it to the obj
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?KEY=${API_KEY}`);
    state.recipe = createRecipeObj(data);
    //Adding new property bookmarked to recipe opj:
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    //console.log((state.recipe = recipe));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.result = data.data.recipes.map(element => {
      return {
        id: element.id,
        title: element.title,
        publisher: element.publisher,
        image: element.image_url,
        ...(element.key && { key: element.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//Pagination
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

//Persist bookmarks in loacal storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipie) {
  //Add to bookmarks array in state obj
  state.bookmarks.push(recipie);

  //Mark current recipie as bookmarks
  if (recipie.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  //Add to local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Remove recipie from bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipie as not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient') && el[1] != '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length != 3) {
          throw new Error(
            "'Wrong ingrdient format! Please use the correct format"
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //Create new recipie obj
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    //insert that data into the resultsView
    state.recipe = createRecipeObj(data);

    //bookmark that recipe
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  //fetch bookmarks from local storage
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) {
    state.bookmarks = storage;
  }
};

init();

const clearStorage = function () {
  localStorage.clear('bookmarks');
};
//clearStorage();
