document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("nav-menu");
  const body = document.body;

  burger.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    body.classList.toggle("slide-down");
  });
});
