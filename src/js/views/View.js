//import svg file
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const html = this._generateMarkup();

    if (render === false) {
      return html;
    }
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    this._data = data;
    const newHtml = this._generateMarkup();
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    //convert HTML markup string to a DOM elemnet
    const newDOM = document.createRange().createContextualFragment(newHtml);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    //compare both the arrays
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      //Check id two elements are same or different
      //console.log(curEl, newEl.isEqualNode(curEl));
      //for elements that have text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //for elements with changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `<div class="spinner">
                <svg>
                  <use href="${icons}.svg#icon-loader"></use>
                </svg>
              </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const html = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderSuccessMsg(message = this._successMessage) {
    const html = ` <div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>; <p>
                     ${message}
                    </p>
                  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
