
    const movie = JSON.parse(localStorage.getItem("selectedMovie"));

    const titleEl = document.getElementById("movieTitle");
    const imageEl = document.getElementById("movieImage");
    const descEl = document.getElementById("movieDescription");
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackInput = document.getElementById("feedbackInput");
    const feedbackList = document.getElementById("feedbackList");
    const feedbackSection = document.getElementById("feedbackSection");

    if (!movie) {
      titleEl.textContent = "No movie selected.";
      imageEl.style.display = "none";
      descEl.style.display = "none";
      feedbackSection.style.display = "none";
    } else {
      titleEl.textContent = movie.title || movie.name || "Untitled";
      descEl.textContent = movie.overview || "No description available.";

      if (movie.backdrop_path) {
        imageEl.src = "https://image.tmdb.org/t/p/original" + movie.backdrop_path;
        imageEl.alt = movie.title || movie.name;
        imageEl.style.display = "block";
      } else {
        imageEl.style.display = "none";
      }
    }

    function loadFeedback() {
      let allFeedback = JSON.parse(localStorage.getItem("movieFeedbacks")) || {};
      let movieId = movie.id;
      let feedbacks = allFeedback[movieId] || [];

      feedbackList.innerHTML = "";

      if (feedbacks.length === 0) {
        feedbackList.innerHTML = "<p>No feedback yet. Be the first to comment!</p>";
        return;
      }

      feedbacks.forEach(function (fb) {
        let div = document.createElement("div");
        div.textContent = fb;
        feedbackList.appendChild(div);
      });
    }

    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let newFeedback = feedbackInput.value.trim();
      if (!newFeedback) return;

      let allFeedback = JSON.parse(localStorage.getItem("movieFeedbacks")) || {};
      let movieId = movie.id;

      if (!allFeedback[movieId]) {
        allFeedback[movieId] = [];
      }

      allFeedback[movieId].push(newFeedback);
      localStorage.setItem("movieFeedbacks", JSON.stringify(allFeedback));

      feedbackInput.value = "";
      loadFeedback();
    });

    if (movie) {
      loadFeedback();
    }