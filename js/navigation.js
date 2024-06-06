window.showMenu = function () {
  console.log("Showing Menu");

  const menu = getMenu();
  menu.classList.add("opened-menu");
};

window.hideMenu = function () {
  console.log("Hide Menu");

  const menu = getMenu();
  menu.classList.remove("opened-menu");
};

function getMenu() {
  return document.getElementById("menu");
}
