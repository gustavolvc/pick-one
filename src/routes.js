let page = 1;
let infiniteScroll;
let totalPages;

searchBtn.addEventListener("click", () => {
  if (headerInput.value) {
    location.hash = "#search=" + headerInput.value;
  }
});
headerInput.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    location.hash = "#search=" + headerInput.value;
  }
});

homeBtn.addEventListener("click", () => {
  homePage();
});
trendsBtn.addEventListener("click", () => {
  location.hash = "#trends";
});
backBtn.addEventListener("click", () => {
  // history.back();
  const stateLoad = window.history.state ? window.history.state.loadUrl : "";
  if (stateLoad.includes("#")) {
    window.location.hash = "";
  } else {
    window.history.back();
  }
  headerInput.value = "";
});
goToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

// window.addEventListener("DOMContentLoaded", routing, false);
window.addEventListener(
  "DOMContentLoaded",
  () => {
    routing();
    window.history.pushState({ loadUrl: window.location.href }, null, "");
  },
  false
);
window.addEventListener("hashchange", routing, false);
window.addEventListener("scroll", infiniteScroll, false);
window.addEventListener("scroll", () => {
  if (
    document.body.scrollTop > 400 ||
    document.documentElement.scrollTop > 400
  ) {
    goToTop.classList.remove("inactive");
  } else {
    if (
      document.body.scrollTop <= 400 ||
      document.documentElement.scrollTop <= 400
    ) {
      goToTop.classList.add("inactive");
    }
  }
});

lang.addEventListener("change", () => {  
  localStorage.setItem("selectedlanguage", lang.value);  
  window.location.reload();
});

function routing() {
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }
  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    movieFullInfoPage();
  } else if (location.hash.startsWith("#category=")) {
    categoriesPage();
  } else {
    homePage();
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }
}

function activeInactive(text) {
  headerContainer.classList.add("inactive");
  sectionTrends.classList.add("inactive");
  sectionCategories.classList.add("inactive");
  sectionFullInfo.classList.add("inactive");
  sectionFavoriteMovies.classList.add("inactive");
  cardsHead.classList.remove("inactive");
  cardsCard.classList.remove("inactive");
  cardsHeadTitle.innerHTML = text;
}

function homePage() {
  headerContainer.classList.remove("inactive");
  sectionTrends.classList.remove("inactive");
  sectionCategories.classList.remove("inactive");
  sectionFavoriteMovies.classList.remove("inactive");
  cardsHead.classList.add("inactive");
  cardsCard.classList.add("inactive");
  sectionFullInfo.classList.add("inactive");
  getLanguagesList();
  createTrendsPreview();
  getGenreButtons();
  createFavoritesMovies();
}

function trendsPage() {
  activeInactive("Trending");
  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}

function categoriesPage() {
  const categoryData = location.hash.split("=");
  const [categoryId, categoryName] = categoryData[1].split("-");
  activeInactive(categoryName);
  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function searchPage() {
  activeInactive("Search");
  const query = location.hash.split("=");
  getMoviesBySearch(query[1]);
  infiniteScroll = getPaginatedMoviesBySearch(query[1]);
}

function movieFullInfoPage() {
  headerContainer.classList.add("inactive");
  sectionTrends.classList.add("inactive");
  sectionCategories.classList.add("inactive");
  cardsHead.classList.add("inactive");
  cardsCard.classList.add("inactive");
  sectionFavoriteMovies.classList.add("inactive");
  sectionFullInfo.classList.remove("inactive");

  const movieId = location.hash.split("=");
  getMovieById(movieId[1]);
}
