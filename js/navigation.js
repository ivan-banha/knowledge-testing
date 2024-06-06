window.showMenu = function () {
  const menu = document.getElementById("menu");
  menu.classList.add("opened-menu");
};

window.hideMenu = function () {
  const menu = document.getElementById("menu");
  menu.classList.remove("opened-menu");
};
