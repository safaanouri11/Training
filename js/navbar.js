document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const adminLink = document.getElementById("adminOnlyLink");
  const authBtn   = document.getElementById("authBtn");

  // إذا في مستخدم مسجل
  if (user) {

    // 🔹 عرض Register فقط للـ superadmin
    if (user.role === "superadmin") {
      adminLink.style.display = "block";
    }

    // 🔹 حول Login → Logout
    authBtn.textContent = "Logout";

    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });

  } else {

    // 🔹 لو مش مسجل → Login
    authBtn.textContent = "Login";

    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "login.html";
    });
  }

});