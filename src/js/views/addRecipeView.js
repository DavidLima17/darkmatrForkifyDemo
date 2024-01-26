import View from './View.js';

/**
 * Represents a view for adding a recipe.
 * @class
 * @extends View
 */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  /**
   * Represents the constructor of the AddRecipeView class.
   * @constructor
   */
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  /**
   * Toggles the visibility of the window and overlay elements.
   */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /**
   * Adds an event handler to show the window.
   *
   * @param {Function} handler - The handler function to be called when the window is shown.
   */
  _addHandlerShowWindow(handler) {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Adds event handlers to hide the window.
   *
   * @param {Function} handler - The handler function to be called when the window is hidden.
   */
  _addHandlerHideWindow(handler) {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Adds an event listener to the parent element for the 'submit' event.
   * When the form is submitted, it prevents the default form submission behavior,
   * retrieves the form data, and calls the provided handler function with the data.
   *
   * @param {Function} handler - The handler function to be called with the form data.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
