const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");
const overlay = document.getElementById("menu-overlay");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  nav.classList.toggle("flex");
  nav.classList.toggle("hidden");
  overlay.classList.toggle("show");
});
