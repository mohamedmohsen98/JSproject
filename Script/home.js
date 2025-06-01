var token =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM";

var currentIndex = 0; // Current selected movie index (global in full data)
var currentPage = 0; // Current page number shown in footer slider
var fullData = null; // All fetched results stored here
var pageSize = 10; // Number of movies shown per page

// DOM Elements references
var footerImages = document.querySelector(".footer__cards");
var title = document.querySelector(".hero__container__content h2");
var desc = document.querySelector(".hero__container__content p");
var main = document.querySelector("main");
var playButton = document.getElementById("playButton");
var searchInput = document.getElementById("searchInput");

/**
 * Update the hero section (main background, title, description)
 * based on the movie index in the global fullData.
 */
function updateHero(index) {
  if (!fullData || !fullData.results) return;
  var item = fullData.results[index];
  currentIndex = index;

  var backdrop = item.backdrop_path || item.profile_path || "";
  var name = item.title || item.name || "Untitled";
  var overview =
    item.overview || item.known_for_department || "No description available.";

  main.style.backgroundImage = backdrop
    ? "url(https://image.tmdb.org/t/p/original" + backdrop + ")"
    : "none";

  title.textContent = name;
  desc.textContent = overview;
}

/**
 * Render a specific page of results in the footer slider.
 * Shows pageSize items starting from page * pageSize.
 */
function renderPage(page) {
  if (!fullData || !fullData.results) {
    footerImages.innerHTML = "<p>No results found.</p>";
    return;
  }
// SLIDER
  var start = page * pageSize;
  var end = start + pageSize;
  var slice = fullData.results.slice(start, end);

  if (slice.length === 0) return; // no more pages available

  currentPage = page;

  var cartoona = "";
  for (var i = 0; i < slice.length; i++) {
    var item = slice[i];
    var imgPath = item.poster_path || item.profile_path || "";
    if (!imgPath) imgPath = "";

    cartoona +=
      '<div class="footer__cards__item">' +
      '<img src="https://image.tmdb.org/t/p/w500' +
      imgPath +
      '" alt="' +
      (item.title || item.name || "") +
      '" data-index="' +
      (start + i) + // global index for correct mapping
      '">' +
      "</div>";
  }

  footerImages.innerHTML = cartoona;

  var imgs = footerImages.querySelectorAll("img");

  // Add click and hover events to update hero section
  for (var j = 0; j < imgs.length; j++) {
    imgs[j].addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-index"));
      updateHero(idx);
    });

    imgs[j].addEventListener("mouseover", function () {
      var idx = parseInt(this.getAttribute("data-index"));
      updateHero(idx);
    });
  }

  updateHero(start); // Show first movie of this page initially
}

/**
 * Fetch data from TMDB API for a given type ("movie/popular", "tv/popular", "person/popular").
 * Conditionally remove people-background class from main if fetching non-person data.
 */
function fetchData(type) {
  var url = "https://api.themoviedb.org/3/" + type + "?language=en-US&page=1";

  fetch(url, {
    headers: {
      Authorization: token,
    },
  })
    .then(function (response) {
      if (!response.ok)
        throw new Error(
          "Error " + response.status + ": " + response.statusText
        );
      return response.json();
    })
    .then(function (data) {
      fullData = data;
      renderPage(0);
      // Remove people-background only if NOT fetching people data
      if (!type.startsWith("person")) {
        main.classList.remove("people-background");
      }
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
}

/**
 * Filter fullData results based on search query and re-render page 0.
 */
function liveSearch(query) {
  if (!fullData || !fullData.results) return;

  var lowerQuery = query.toLowerCase();
  var filtered = [];

  for (var i = 0; i < fullData.results.length; i++) {
    var item = fullData.results[i];
    var name = item.title || item.name || "";
    if (name.toLowerCase().indexOf(lowerQuery) !== -1) {
      filtered.push(item);
    }
  }

  fullData = { results: filtered }; // Replace fullData with filtered results
  renderPage(0);
}

// Event listeners

// Live search on input
if (searchInput) {
  searchInput.addEventListener("input", function () {
    var query = this.value.trim();
    if (query === "") {
      fetchData("movie/popular"); // Reload original data on empty input
    } else {
      liveSearch(query);
    }
  });
}

// Navigation buttons
document.getElementById("movies").addEventListener("click", function (e) {
  e.preventDefault();
  fetchData("movie/popular");
});

document.getElementById("tv").addEventListener("click", function (e) {
  e.preventDefault();
  fetchData("tv/popular");
});

document.getElementById("people").addEventListener("click", function (e) {
  e.preventDefault();
  main.classList.add("people-background");
  fetchData("person/popular");
});

// Slider navigation buttons
document.getElementById("prevBtn").addEventListener("click", function () {
  if (currentPage > 0) {
    renderPage(currentPage - 1);
  }
});

document.getElementById("nextBtn").addEventListener("click", function () {
  if (
    fullData &&
    fullData.results &&
    (currentPage + 1) * pageSize < fullData.results.length
  ) {
    renderPage(currentPage + 1);
  }
});

// Play button opens details page for current movie
playButton.onclick = function () {
  if (!fullData || !fullData.results || !fullData.results[currentIndex]) return;
  localStorage.setItem(
    "selectedMovie",
    JSON.stringify(fullData.results[currentIndex])
  );
  window.open("details.html", "_blank");
};

// Logout button clears session and redirects
document.getElementById("logout").addEventListener("click", logout);
function logout() {
  sessionStorage.removeItem("authToken");
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 2000);
}

// Initial load - fetch popular movies
fetchData("movie/popular");
