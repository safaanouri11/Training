document.addEventListener("DOMContentLoaded", () => {

  // ===== View Menu Button =====
  const viewMenuBtn = document.getElementById("viewMenuBtn");
  const menusSection = document.getElementById("menus");

  if (viewMenuBtn && menusSection) {
    viewMenuBtn.addEventListener("click", () => {
      menusSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Mobile Menu Toggle =====
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    document.querySelectorAll("#navLinks a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });
  }

});