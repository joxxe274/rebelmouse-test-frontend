(function () {
  document.addEventListener("DOMContentLoaded", function() {
    const menuButton = document.getElementsByClassName('side-bar-button--menu')[0];
    const closeMenuButton = document.getElementsByClassName('close-menu')[0];
    const overlay = document.getElementsByClassName('overlay')[0];
    const sideBarMenu = document.getElementsByClassName('nav-menu-mobile')[0];
    console.log(closeMenuButton);
    // open menu
    const openMenu = (e) => {
      e.preventDefault();
      if (!sideBarMenu.classList.contains('nav-menu-mobile--open')) {
        sideBarMenu.classList.add('nav-menu-mobile--open');
      } else {
        sideBarMenu.classList.add('nav-menu-mobile--closed');
        setTimeout(() => {
          sideBarMenu.classList.remove('nav-menu-mobile--closed');
          sideBarMenu.classList.remove('nav-menu-mobile--open');
        }, 500);
      }
    }
    menuButton.addEventListener('click', openMenu);
    closeMenuButton.addEventListener('click', openMenu);
    overlay.addEventListener('click', openMenu);
  });
}());
