import PicturesApiServices from './fetch-images';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  boxGallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
});

const picturesApi = new PicturesApiServices();

refs.form.addEventListener('submit', searchInputQuery);
refs.btnMore.addEventListener('click', showMorePictures);

async function searchInputQuery(event) {
  event.preventDefault();
  refs.boxGallery.innerHTML = '';
  refs.btnMore.style.display = 'none';
  picturesApi.resetPage();

  if (refs.searchInput.value !== '') {
    picturesApi.query = refs.searchInput.value;
    const getArrayImg = await picturesApi.fetchPictures();
    markupPictureCards(getArrayImg.hits);
    lightbox.refresh();
    picturesApi.incrementPage();
    if (getArrayImg.hits.length > 10) {
      refs.btnMore.style.display = 'block';
    }

    if (getArrayImg.hits.length !== 0) {
      Notify.success(`Hooray! We found ${getArrayImg.totalHits} images.`);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}

async function showMorePictures() {
  const getArrayImg = await picturesApi.fetchPictures();
  markupPictureCards(getArrayImg.hits);
  lightbox.refresh();
  picturesApi.incrementPage();
}

function markupPictureCards(getArrayImg) {
  const markup = getArrayImg.map(card => {
    return `<a href="${card.largeImageURL}"><div class="photo-card">
    <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${card.likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${card.views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${card.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${card.downloads}
      </p>
    </div>
  </div></a>`;
  });
  refs.boxGallery.insertAdjacentHTML('beforeend', markup.join(''));
}
