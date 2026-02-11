document.addEventListener("DOMContentLoaded", () => {

  // ===== View Menu Button =====
 const viewMenuBtn = document.getElementById("viewMenuBtn");

if (viewMenuBtn) {
  viewMenuBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
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