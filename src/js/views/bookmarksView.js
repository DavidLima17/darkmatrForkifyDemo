import View from './View.js';
import PreviewView from './previewView.js';

/**
 * Represents a view for displaying bookmarks.
 * @extends View
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  /**
   * Adds an event listener to the window's load event and executes the provided handler function.
   *
   * @param {Function} handler - The function to be executed when the window loads.
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /**
   * Generates the markup for the bookmarks view.
   * @returns {string} The generated markup.
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
