//import svg file
import icons from 'url:../../img/icons.svg';
//var Fraction = require('fractional').Fraction;
//console.log(Fraction);
import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'Could not find the recipe. Please try again later';
  _successMessage = '';

  _generateMarkup() {
    return `<figure class="recipe__fig">
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
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-serving="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-serving="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
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
              <use href="${icons}.svg#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients
            .map(this._generateMarkupIngredient)
            .join('')}           

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
              <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  _generateMarkupIngredient(element) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}.svg#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      element.quantity ? element.quantity : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${element.unit}</span>
      ${element.description}
    </div>
  </li>`;
  }
  //publisher-subscriber pattern
  addHandlerRender(handler) {
    //listen for hash change and load page event
    ['hashchange', 'load'].forEach(element => {
      window.addEventListener(element, handler);
    });
  }
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const newServing = +btn.dataset.updateServing;
      if (newServing > 0) handler(newServing);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
}

export default new RecipeView();
