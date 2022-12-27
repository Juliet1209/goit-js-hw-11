const axios = require('axios').default;
import { Notify } from 'notiflix';
const btnMore = document.querySelector('.load-more');

export default class PicturesApiServices {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY_API = '31525078-c25aa98820f24120add7be3d2';
    const numberPage = 40;
    const paramentrsFetch = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=${numberPage}&page=${this.page}`;
    const resaltSearch = await axios.get(
      `${BASE_URL}?key=${KEY_API}&q=${this.searchQuery}${paramentrsFetch}`
    );
    if (
      this.page > resaltSearch.data.totalHits / numberPage &&
      resaltSearch.data.hits.length > 10
    ) {
      btnMore.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    return resaltSearch.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery.trim();
  }
}
