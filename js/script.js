document.addEventListener("DOMContentLoaded", () => {

  // Default superadmin
  if (!localStorage.getItem("users")) {
    const defaultUser = [{
      id: 1,
      name: "Super Admin",
      username: "superadmin",
      email: "admin@system.com",
      password: "Super@123",
      mobile: "970599999999",
      restaurant: "Main Restaurant",
      role: "superadmin"
    }];
    localStorage.setItem("users", JSON.stringify(defaultUser));
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const authBtn = document.getElementById("authBtn");
  const adminLink = document.getElementById("adminOnlyLink");

  // Auth button logic
  if (authBtn) {
    if (currentUser) {
      authBtn.textContent = "Logout";
      authBtn.classList.add("logout-style");
      authBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
      });

      if (currentUser.role === "superadmin" && adminLink) {
        adminLink.style.display = "inline-block";
      }
    } else {
      authBtn.textContent = "Login";
      authBtn.setAttribute("href", "login.html");
      if (adminLink) adminLink.style.display = "none";
    }
  }

  // View Menu button
  const viewMenuBtn = document.getElementById("viewMenuBtn");
  if (viewMenuBtn) {
    viewMenuBtn.addEventListener("click", () => {
      window.location.href = "menu.html";
    });
  }

});

// Logout function
function logoutUser() {
  localStorage.removeItem("currentUser");
  setTimeout(() => { window.location.href = "login.html"; }, 50);
}