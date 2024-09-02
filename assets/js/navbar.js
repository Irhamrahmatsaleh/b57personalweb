document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("nav-menu");

  burger.addEventListener("click", function () {
    navMenu.classList.toggle("show");
  });
});
