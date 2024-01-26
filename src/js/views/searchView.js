/**
 * Represents a search view.
 * @class
 */
class SearchView {
  #parentEl = document.querySelector('.search');

  /**
   * Retrieves the value of the search query from the input field and clears the input.
   * @returns {string} The search query.
   */
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  /**
   * Adds a search event handler to the parent element.
   *
   * @param {Function} handler - The function to be called when the search event is triggered.
   */
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  /**
   * Clears the input field of the search view.
   * @private
   */
  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
