import View from './View.js';
import PreviewView from './previewView.js';

/**
 * Represents a view for displaying search results.
 * @class
 * @extends View
 * @TODO Add ability to sort search results by duration
 * @TODO Add ability to sort search by number of ingredients.
 */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  /**
   * Generates the markup for the results view.
   * @returns {string} The generated markup.
   */
  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
