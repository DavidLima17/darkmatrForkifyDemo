import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

/**
 * Represents the application state.
 * @typedef {Object} State
 * @property {Object} recipe - The currently selected recipe.
 * @property {Object} search - The search state.
 * @property {string} search.query - The search query.
 * @property {Array} search.results - The search results.
 * @property {number} search.page - The current page of search results.
 * @property {number} search.resultsPerPage - The number of search results per page.
 * @property {Array} bookmarks - The bookmarked recipes.
 */

/**
 * The application state.
 * @type {State}
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Creates a recipe object based on the provided data.
 *
 * @param {Object} data - The data containing the recipe information.
 * @returns {Object} - The created recipe object.
 */
const createRecipeObject = function (data) {
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
    ...(recipe.key && { key: recipe.key }), // if recipe.key exists, add the object
  };
};

/**
 * Loads a recipe from the API and updates the state.
 *
 * @param {string} id - The ID of the recipe to load.
 * @throws {Error} If an error occurs while loading the recipe.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

/**
 * Loads search results based on the provided query.
 * @param {string} query - The search query.
 * @returns {Promise<void>} - A promise that resolves when the search results are loaded.
 * @throws {Error} - If there is an error while loading the search results.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }), // if recipe.key exists, add the object
      };
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a specific page of search results.
 *
 * @param {number} [page=state.search.page] - The page number to retrieve. Defaults to the current page in the state.
 * @returns {Array} - An array containing the search results for the specified page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  return state.search.results.slice(
    (page - 1) * state.search.resultsPerPage, // start
    page * state.search.resultsPerPage // end
  );
};

/**
 * Updates the servings of the recipe and adjusts the quantities of ingredients accordingly.
 * @param {number} newServings - The new number of servings for the recipe.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

/**
 * Persists the bookmarks to the local storage.
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a bookmark for a recipe.
 *
 * @param {Object} recipe - The recipe object to be bookmarked.
 */
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Removes a bookmark from the state.bookmarks array and updates the state.recipe.bookmarked property if necessary.
 * @param {string} id - The ID of the bookmark to be removed.
 */
export const removeBookmark = function (id) {
  // Remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

/**
 * Initializes the application by retrieving bookmarks from local storage.
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

/**
 * Uploads a recipe.
 * @param {Object} newRecipe - The new recipe to upload.
 * @returns {Promise<void>} - A promise that resolves when the recipe is uploaded.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
