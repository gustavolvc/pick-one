const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

let lazyLoading = new IntersectionObserver((movies) => {
  movies.forEach((movie) => {
    if (movie.isIntersecting) {
      const url = movie.target.getAttribute("data-img");
      movie.target.setAttribute("src", url);
    }
  });
});

async function createCardsMovies(movies, lazyLoad = false) {
  cardsCard.innerHTML = "";
  movies.forEach((movie) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("main__cardContainer");
    const movieImg = document.createElement("img");
    movieImg.classList.add("main__cardImg");
    movieImg.setAttribute("alt", movie.title);

    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
      );
    });

    if (lazyLoad) {
      lazyLoading.observe(movieImg);
    }

    movieImg.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    const cardContainerInfo = document.createElement("div");
    cardContainerInfo.classList.add("main__cardContainerInfo");
    const cardInfoPrimary = document.createElement("div");
    cardInfoPrimary.classList.add("main__cardInfoPrimary");
    const cardReleaseDate = document.createElement("p");
    cardReleaseDate.innerText = "Release date:";
    cardReleaseDate.classList.add("main__cardReleaseDate");
    const cardTitleText = document.createElement("p");
    cardTitleText.innerText = movie.title;
    cardTitleText.classList.add("main__cardTitleText");
    const cardReleaseDateText = document.createElement("p");
    cardReleaseDateText.innerText = movie.release_date;
    cardReleaseDateText.classList.add("main__cardReleaseDateText");
    const cardStar = document.createElement("ion-icon");
    cardStar.setAttribute("name", "star-sharp");
    cardStar.classList.add("main__cardStar");
    const cardBookmark = document.createElement("ion-icon");
    cardBookmark.setAttribute("name", "bookmark-outline");
    cardBookmark.classList.add("main__cardBookmark");
    const cardHeart = document.createElement("ion-icon");
    cardHeart.setAttribute("name", "heart-outline");
    cardHeart.classList.add("main__cardHeart");
    const cardStarText = document.createElement("p");
    cardStarText.innerText = movie.vote_average;
    cardStarText.classList.add("main__cardStarText");
    const cardInfoSecundary = document.createElement("div");
    cardInfoSecundary.classList.add("main__cardInfoSecundary");
    const cardInfoSecundaryStar = document.createElement("div");
    cardInfoSecundaryStar.classList.add("main__cardInfoSecundaryStar");
    cardInfoSecundaryStar.appendChild(cardStarText);
    cardInfoSecundaryStar.appendChild(cardStar);
    cardInfoPrimary.appendChild(cardTitleText);
    cardInfoPrimary.appendChild(cardReleaseDate);
    cardInfoPrimary.appendChild(cardReleaseDateText);
    cardInfoSecundary.appendChild(cardInfoSecundaryStar);
    cardInfoSecundary.appendChild(cardBookmark);
    cardInfoSecundary.appendChild(cardHeart);
    cardContainerInfo.appendChild(cardInfoPrimary);
    cardContainerInfo.appendChild(cardInfoSecundary);
    cardContainer.appendChild(movieImg);
    cardContainer.appendChild(cardContainerInfo);
    cardsCard.appendChild(cardContainer);
  });
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  createCardsMovies(movies, true);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  createCardsMovies(movies, true);
}

function createImgList(movies, container, lazyLoad = false) {
  trendsPreview.innerHTML = "";
  movies.forEach((movie, index) => {
    const img = document.createElement("img");
    img.classList.add("main__trendsPreviewImg");
    img.setAttribute("alt", movie.title);

    img.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    img.addEventListener("error", () => {      
      img.setAttribute(
        "src",
        "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
      );
    });

    if (lazyLoad) {
      lazyLoading.observe(img);
    }

    img.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    container.appendChild(img);
  });
  return container;
}

function createGenreButtons(genres, container) {
  categories.innerHTML = "";
  genres.forEach((genre, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("main__categoriesBtn");
    btn.innerText = genre.name;
    btn.setAttribute("id", "id" + genre.id);
    btn.addEventListener("click", () => {
      location.hash = `#category=${genre.id}-${genre.name}`;
    });
    container.appendChild(btn);
  });
  return container;
}

async function getGenreButtons() {
  const { data } = await api("genre/movie/list");
  const genres = data.genres;
  createGenreButtons(genres, categories);
}

async function createTrendsPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  createImgList(movies, trendsPreview, true);
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  createCardsMovies(movies, true);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const movies = data.results;
  if (movies.length === 0) {
    return 0;
  } else {
    const infoRelatedMoviesContainer = document.createElement("div");
    infoRelatedMoviesContainer.classList.add("main__infoRelatedMovies");
    let infoRelatedMovies = document.createElement("figure");
    infoRelatedMovies = createImgList(movies, infoRelatedMovies, true);
    infoRelatedMoviesContainer.appendChild(infoRelatedMovies);
    return infoRelatedMoviesContainer;
  }
}

async function getMovieById(id) {
  fullInfoArticle.innerHTML = "";
  const { data: movie } = await api(`movie/${id}`);

  const backPosterImg = document.createElement("img");
  backPosterImg.classList.add("main__infoBackPoster");
  backPosterImg.setAttribute("alt", movie.title);
  backPosterImg.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
  );
  backPosterImg.addEventListener("error", () => {
    backPosterImg.setAttribute(
      "src",
      "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
    );
  });

  const posterImg = document.createElement("img");
  posterImg.classList.add("main__infoPoster");
  posterImg.setAttribute("alt", movie.title);
  posterImg.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w300${movie.poster_path}`
  );
  posterImg.addEventListener("error", () => {
    posterImg.setAttribute(
      "src",
      "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png"
    );
  });

  const title = document.createElement("p");
  title.innerText = movie.title;
  title.classList.add("main__infoTitle");

  const cardReleaseDateText = document.createElement("p");
  cardReleaseDateText.innerText = movie.release_date;
  const cardStar = document.createElement("ion-icon");
  cardStar.setAttribute("name", "star-sharp");
  const cardBookmark = document.createElement("ion-icon");
  cardBookmark.setAttribute("name", "bookmark-outline");
  const cardHeart = document.createElement("ion-icon");
  cardHeart.setAttribute("name", "heart-outline");
  const cardStarText = document.createElement("p");
  cardStarText.innerText = movie.vote_average;
  const infoIcons = document.createElement("div");
  infoIcons.classList.add("main__infoIcons");
  const infoIconsStarText = document.createElement("div");
  infoIconsStarText.appendChild(cardStar);
  infoIconsStarText.appendChild(cardStarText);
  infoIcons.appendChild(infoIconsStarText);
  infoIcons.appendChild(cardBookmark);
  infoIcons.appendChild(cardHeart);

  let infoGenres = document.createElement("div");
  infoGenres = createGenreButtons(movie.genres, infoGenres);
  infoGenres.classList.add("main__infoGenres");

  const overview = document.createElement("p");
  overview.innerText = movie.overview;
  overview.classList.add("main__infoOverview");

  const releaseDate = document.createElement("p");
  releaseDate.innerHTML = `<p class="main__infoSubTitle">Release date:</p> ${movie.release_date}`;
  releaseDate.classList.add("main__infoReleaseDate");

  const rateCount = document.createElement("p");
  rateCount.innerHTML = `<p class="main__infoSubTitle">Rate count:</p> ${movie.vote_count}`;
  rateCount.classList.add("main__infoRateCount");

  const recommendationsText = document.createElement("p");
  recommendationsText.innerText = "Recommendations";
  recommendationsText.classList.add("main__infoRelatedMoviesText");

  let infoRelatedMoviesContainer = await getRelatedMoviesId(id);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("main__infobackBtn");

  btn.addEventListener("click", () => {
    history.back();
    headerInput.value = "";
  });
  btn.innerHTML = `<ion-icon class="main__infobackBtnIcon" name="chevron-back"></ion-icon>
     Back`;

  fullInfoArticle.appendChild(backPosterImg);
  fullInfoArticle.appendChild(posterImg);
  fullInfoArticle.appendChild(infoIcons);
  fullInfoArticle.appendChild(title);
  fullInfoArticle.appendChild(infoGenres);
  fullInfoArticle.appendChild(overview);
  fullInfoArticle.appendChild(releaseDate);
  fullInfoArticle.appendChild(rateCount);
  if (infoRelatedMoviesContainer !== 0) {
    fullInfoArticle.appendChild(recommendationsText);
    fullInfoArticle.appendChild(infoRelatedMoviesContainer);
  }
  fullInfoArticle.appendChild(btn);
}
