let loginBtn = document.querySelector(".head__form__login");
let em = document.querySelector(".head__form__email");
let pw = document.querySelector(".head__form__password");
let p = document.querySelector(".error-message");
const emailRegex = /.+@.+\..+/; //something@something.something
const passwordRegex = /.{6,}/; //atleast any 6 chars

loginBtn.addEventListener("click", logIn);

async function logIn() {
  if (!emailRegex.test(em.value) || !passwordRegex.test(pw.value)) {
    p.style.display = "block";
    em.classList.add("invalid");
    pw.classList.add("invalid");
    return;
  }
  try {
    p.style.display = "none";
    em.classList.remove("invalid");
    pw.classList.remove("invalid");

    const res = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM",
      },
    });

    const data = await res.json();
    window.location.href="https://www.netflix.com/eg-en/";

  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
}
