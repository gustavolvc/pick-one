searchBtn.addEventListener("click", () => {
  location.hash = "#search=" + headerInput.value;
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
  history.back();
});

window.addEventListener("DOMContentLoaded", routing, false);
window.addEventListener("hashchange", routing, false);

function routing() {
  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    movieDetailsPage();
  } else if (location.hash.startsWith("#category=")) {
    categoriesPage();
  } else {
    homePage();
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function activeInactive(text) {
  headerContainer.classList.add("inactive");
  sectionTrends.classList.add("inactive");
  sectionCategories.classList.add("inactive");
  cardsHead.classList.remove("inactive");
  cardsCard.classList.remove("inactive");
  cardsHeadTitle.innerHTML = text;
}

function homePage() {
  console.log("Home!!");

  headerContainer.classList.remove("inactive");
  sectionTrends.classList.remove("inactive");
  sectionCategories.classList.remove("inactive");
  cardsHead.classList.add("inactive");
  cardsCard.classList.add("inactive");
  createTrendsPreview();
  createGenreButtons();
}

function trendsPage() {
  console.log("TRENDS!!");

  activeInactive("Trends");
  getTrendingMovies();
}

function categoriesPage() {
  console.log("categories!!");

  const categoryData = location.hash.split("=");
  const [categoryId, categoryName] = categoryData[1].split("-");
  activeInactive(categoryName);
  getMoviesByCategory(categoryId);
}

function searchPage() {
  console.log("Search!!");

  activeInactive("Search");
  const query = location.hash.split("=");
  getMoviesBySearch(query[1]);
}
