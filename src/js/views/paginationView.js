//import svg file
import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    console.log(numPage);
    const currentPage = this._data.page;

    //Page 1, and there are other pages
    if (currentPage === 1 && numPage > 1)
      return `<button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;

    //Last page
    if (currentPage === numPage)
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`;

    //Any other page
    if (currentPage < numPage)
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
         </svg>
     <span>Page ${currentPage - 1}</span>
        </button>
         <button data-goto="${
           currentPage + 1
         }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;

    //Page 1, and there are NO other pages
    return ``;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      console.log(btn);
      console.log(goto);
      handler(goto);
    });
  }
}

export default new PaginationView();
