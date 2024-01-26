import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

/**
 * Represents a view for preview items.
 * @class
 * @extends View
 */
class PreviewView extends View {
  _parentElement = '';

  /**
   * Generates the markup for a preview item.
   * @param {Object} result - The result object containing data for the preview item.
   * @returns {string} - The generated markup.
   */
  _generateMarkup(result) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        </div>
      </a>
    </li>
    `;
  }
}

export default new PreviewView();