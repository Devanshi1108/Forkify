//import svg file
import icons from 'url:../../img/icons.svg';
import View from './View';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet found. Please try again later';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
