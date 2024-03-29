import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2
import fracty from 'fracty';
/**
 * Represents a view for displaying recipe details.
 * @extends View
 */
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  /**
   * Adds an event listener for 'hashchange' and 'load' events and calls the provided handler function.
   *
   * @param {Function} handler - The handler function to be called when the events occur.
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Adds an event listener to update the servings of a recipe.
   *
   * @param {Function} handler - The function to handle the update servings event.
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  /**
   * Adds an event listener to the parent element for the bookmark button.
   * @param {Function} handler - The function to be called when the bookmark button is clicked.
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerDeleteRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.delete');
      if (!btn) return;

      const confirmDelete = confirm(
        'Are you sure you want to delete this recipe?'
      );
      if (!confirmDelete) return;
      handler();
    });
  }

  /**
   * Generates the markup for the recipe view.
   * @returns {string} The generated markup.
   */
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
      <button class="btn--round delete ${this._data.key ? '' : 'hidden'}">
        <svg class="">
          <use href="${icons}#icon-alert-circle"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this.#generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
          `;
  }

  /**
   * Generates the markup for a single ingredient in the recipe.
   *
   * @param {Object} ing - The ingredient object.
   * @param {number} ing.quantity - The quantity of the ingredient.
   * @param {string} ing.unit - The unit of measurement for the ingredient.
   * @param {string} ing.description - The description of the ingredient.
   * @returns {string} The HTML markup for the ingredient.
   */
  #generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? fracty(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
  }
}

export default new RecipeView();
