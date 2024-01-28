import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

/**
 * Represents a pagination view.
 * @class
 * @extends View
 * @TODO Add ability to see number of pages between prev and next buttons.
 */
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Adds a click event handler to the parent element.
   * @param {Function} handler - The function to be called when a click event occurs.
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  /**
   * Generates the markup for the pagination view.
   * @returns {string} The generated markup.
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this.#generateMarkupButton(curPage, 'next');
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this.#generateMarkupButton(curPage, 'prev');
    }

    // Other page
    if (curPage < numPages) {
      return `
      ${this.#generateMarkupButton(curPage, 'prev')}
      ${this.#generateMarkupButton(curPage, 'next')}
      `;
    }

    // Page 1, and there are no other pages
    return '';
  }

  /**
   * Generates the markup for a pagination button.
   *
   * @param {number} curPage - The current page number.
   * @param {string} type - The type of button ('prev' or 'next').
   * @returns {string} The generated markup for the pagination button.
   */
  #generateMarkupButton(curPage, type) {
    return `
    <button data-goto="${
      type === 'prev' ? curPage - 1 : curPage + 1
    }" class="btn--inline pagination__btn--${type}">
      <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${
      type === 'prev' ? 'left' : 'right'
    }"></use>
      </svg>
    </button>
    `;
  }
}

export default new PaginationView();
