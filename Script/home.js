var token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM";

var currentIndex = 0;
var currentPage = 0;
var fullData = null;
var pageSize = 10;

var footerImages = document.querySelector(".footer__cards");
var title = document.querySelector(".hero__container__content h2");
var desc = document.querySelector(".hero__container__content p");
var main = document.querySelector("main");
var playButton = document.getElementById("playButton");
var searchInput = document.getElementById("searchInput");
var trailerModal = document.getElementById("trailerModal");
var trailerFrame = document.getElementById("trailerFrame");
var closeTrailer = document.getElementById("closeTrailer");

function updateHero(index) {
  if (!fullData || !fullData.results) return;
  var item = fullData.results[index];
  currentIndex = index;
  var backdrop = item.backdrop_path || item.profile_path || "";
  var name = item.title || item.name || "Untitled";
  var overview = item.overview || item.known_for_department || "No description available.";
  main.style.backgroundImage = backdrop ? "url(https://image.tmdb.org/t/p/original" + backdrop + ")" : "none";
  title.textContent = name;
  desc.textContent = overview;
}

function renderPage(page) {
  if (!fullData || !fullData.results) {
    footerImages.innerHTML = "<p>No results found.</p>";
    return;
  }
  var start = page * pageSize;
  var end = start + pageSize;
  var slice = fullData.results.slice(start, end);
  if (slice.length === 0) return;
  currentPage = page;
  var cartoona = "";
  for (var i = 0; i < slice.length; i++) {
    var item = slice[i];
    var imgPath = item.poster_path || item.profile_path || "";
    if (!imgPath) imgPath = "";
    cartoona += '<div class="footer__cards__item">' + '<img src="https://image.tmdb.org/t/p/w500' + imgPath + '" alt="' + (item.title || item.name || "") + '" data-index="' + (start + i) + '">' + "</div>";
  }
  footerImages.innerHTML = cartoona;
  var imgs = footerImages.querySelectorAll("img");
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
  updateHero(start);
}

function fetchData(type) {
  var url = "https://api.themoviedb.org/3/" + type + "?language=en-US&page=1";
  fetch(url, {
    headers: {
      Authorization: token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Error " + response.status + ": " + response.statusText);
      return response.json();
    })
    .then(function (data) {
      fullData = data;
      renderPage(0);
      if (!type.startsWith("person")) {
        main.classList.remove("people-background");
      }
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
}

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
  fullData = { results: filtered };
  renderPage(0);
}

function fetchTrailerAndPlay(movieId) {
  trailerFrame.src = '';
  trailerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  fetch(url, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const trailers = data.results.filter(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );
      if (trailers.length > 0) {
        const trailerKey = trailers[0].key;
        const youtubeEmbedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;
        trailerFrame.src = youtubeEmbedUrl;
      } else {
        trailerModal.style.display = "none";
        document.body.style.overflow = 'auto';
        alert("No trailer available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching trailer:", error);
      trailerModal.style.display = "none";
      document.body.style.overflow = 'auto';
    });
}

function logout() {
  sessionStorage.removeItem("authToken");
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 2000);
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    var query = this.value.trim();
    if (query === "") {
      fetchData("movie/popular");
    } else {
      liveSearch(query);
    }
  });
}

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

document.getElementById("prevBtn").addEventListener("click", function () {
  if (currentPage > 0) {
    renderPage(currentPage - 1);
  }
});

document.getElementById("nextBtn").addEventListener("click", function () {
  if (fullData && fullData.results && (currentPage + 1) * pageSize < fullData.results.length) {
    renderPage(currentPage + 1);
  }
});

document.getElementById("logout").addEventListener("click", logout);

const youtubeButton = document.getElementById("youtubeButton");
if (youtubeButton) {
  youtubeButton.addEventListener("click", function () {
    if (fullData && fullData.results && fullData.results[currentIndex] && fullData.results[currentIndex].id) {
      const movieId = fullData.results[currentIndex].id;
      fetchTrailerAndPlay(movieId);
    } else {
      alert("Movie ID not available.");
    }
  });
}

playButton.onclick = function () {
  if (!fullData || !fullData.results || !fullData.results[currentIndex]) return;
  localStorage.setItem("selectedMovie", JSON.stringify(fullData.results[currentIndex]));
  window.open("details.html", "_blank");
};

closeTrailer.addEventListener("click", function () {
  trailerModal.style.display = "none";
  trailerFrame.src = "";
  document.body.style.overflow = 'auto';
});

trailerModal.addEventListener("click", function (e) {
  if (e.target === trailerModal) {
    trailerModal.style.display = "none";
    trailerFrame.src = "";
    document.body.style.overflow = 'auto';
  } 
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && trailerModal.style.display === 'flex') {
    trailerModal.style.display = 'none';
    trailerFrame.src = '';
    document.body.style.overflow = 'auto';
  }
});

fetchData("movie/popular");