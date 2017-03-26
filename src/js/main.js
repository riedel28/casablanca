// var $ = require("../../node_modules/jquery/dist/jquery.js");

$(".hamburger").click(function () {
  $(".hamburger").toggleClass("is-active");
  $(".header__menu").toggleClass("header__menu--show");
});
