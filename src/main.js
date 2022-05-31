const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

async function createCardsMovies(movies) {
  cardsCard.innerHTML = "";
  movies.forEach((movie) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("main__cardContainer");
    const movieImg = document.createElement("img");
    movieImg.classList.add("main__cardImg");
    movieImg.setAttribute("alt", movie.title);
    if (movie.poster_path) {
      movieImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      );
    } else {
      movieImg.setAttribute(
        "src",
        `https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png`
      );
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
  createCardsMovies(movies);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  createCardsMovies(movies);
}

async function createGenreButtons() {
  categoriesPreview.innerHTML = "";
  const { data } = await api("genre/movie/list");
  const genres = data.genres;
  genres.forEach((genre, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("main__categoriesPreviewBtn");
    btn.innerText = genre.name;
    btn.setAttribute("id", "id" + genre.id);
    btn.addEventListener("click", () => {
      location.hash = `#category=${genre.id}-${genre.name}`;
    });
    categoriesPreview.appendChild(btn);
  });
}

async function createTrendsPreview() {
  trendsPreview.innerHTML = "";
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  movies.forEach((movie, index) => {
    const img = document.createElement("img");
    img.classList.add("main__trendsPreviewImg");
    img.setAttribute("alt", movie.title);
    if (movie.poster_path) {
      img.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      );
    } else {
      img.setAttribute(
        "src",
        `https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png`
      );
    }
    img.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    trendsPreview.appendChild(img);
  });
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  createCardsMovies(movies);
}
