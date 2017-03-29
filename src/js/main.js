// Header menu function

var hamburger = document.querySelector(".hamburger");
var headerMenu = document.querySelector(".header__menu");

function openMenu() {
  hamburger.addEventListener("click", function() {
    hamburger.classList.toggle("is-active");
    headerMenu.classList.toggle("header__menu--show");
  });
}

openMenu();
