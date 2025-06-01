let loginBtn = document.querySelector(".head__form__login");
let em = document.querySelector(".head__form__email");
let pw = document.querySelector(".head__form__password");
let p = document.querySelector(".error-message");

const emailRegex = /.+@.+\..+/; // something@something.com
const passwordRegex = /.{6,}/; // at least 6 chars

loginBtn.addEventListener("click", logIn);

function logIn() {
  if (!emailRegex.test(em.value) || !passwordRegex.test(pw.value)) {
    p.style.display = "block";
    em.classList.add("invalid");
    pw.classList.add("invalid");
    return;
  }

  p.style.display = "none";
  em.classList.remove("invalid");
  pw.classList.remove("invalid");

  var token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQx...";
  sessionStorage.setItem("authToken", token);

  window.location.href = "../home.html";
}
