const token =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM";

let currentIndex = 0;
let currentData = null;

const footerImages = document.querySelector(".footer__cards");
const title = document.querySelector(".hero__container__content h2");
const desc = document.querySelector(".hero__container__content p");
const main = document.querySelector("main");
const playButton = document.getElementById("playButton");

function updateHero(index) {
  if (!currentData || !currentData.results || !currentData.results[index])
    return;

  let item = currentData.results[index];
  currentIndex = index;

  // Different properties for movies/tv/people
  let backdrop = item.backdrop_path || item.profile_path || "";
  let name = item.title || item.name || "Untitled";
  let overview =
    item.overview || item.known_for_department || "No description available.";

  main.style.backgroundImage = backdrop
    ? `url(https://image.tmdb.org/t/p/original${backdrop})`
    : "none";

  title.textContent = name;
  desc.textContent = overview;
}

function renderData(data, type) {
  if (!data || !data.results || data.results.length === 0) {
    console.warn("No results found in the data.");
    return;
  }

  currentData = data;
  updateHero(0);

  let cartoona = "";
  for (let i = 0; i < data.results.length; i++) {
    let item = data.results[i];
    let imgPath = item.poster_path || item.profile_path || "";
    if (!imgPath) imgPath = ""; // fallback to empty if no image

    cartoona += `
      <div class="footer__cards__item">
        <img 
          src="https://image.tmdb.org/t/p/w500${imgPath}" 
          alt="${item.title || item.name || ""}" 
          data-index="${i}">
      </div>`;
  }

  footerImages.innerHTML = cartoona;

  let posters = document.querySelectorAll(".footer__cards__item img");
  posters.forEach((img) => {
    img.addEventListener("click", function () {
      const idx = parseInt(this.getAttribute("data-index"));
      updateHero(idx);
    });
  });

  playButton.onclick = function () {
    if (!currentData || !currentData.results[currentIndex]) return;
    localStorage.setItem(
      "selectedMovie",
      JSON.stringify(currentData.results[currentIndex])
    );
    window.location.href = "details.html";
  };
}

function fetchData(type = "movie/popular") {
  const url = `https://api.themoviedb.org/3/${type}?language=en-US&page=1`;

  fetch(url, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data for", type, data);
      renderData(data, type);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Event listeners for nav links
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

// Initial load: fetch movies by default
fetchData("movie/popular");

document.getElementById("logout").addEventListener("click", logout);
function logout() {
  sessionStorage.removeItem("authToken");
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 2000);
}
