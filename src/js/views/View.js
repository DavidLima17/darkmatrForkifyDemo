import icons from 'url:../../img/icons.svg'; // Parcel 2

/**
 * Represents a view in the application.
 */
export default class View {
  _data;

  /**
   * Renders the view with the provided data.
   * @param {Array|Object} data - The data to render.
   * @param {boolean} [render=true] - Whether to render the view or return the markup.
   * @returns {string|undefined} - The rendered markup if render is false, otherwise undefined.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Updates the view with new data.
   *
   * @param {Object} data - The new data to update the view with.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert string to DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  /**
   * Renders a spinner element on the view.
   */
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders an error message on the view.
   * @param {string} [message=this._errorMessage] - The error message to be displayed.
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders a message on the view.
   * @param {string} [message=this._message] - The message to be rendered.
   */
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the content of the parent element.
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
