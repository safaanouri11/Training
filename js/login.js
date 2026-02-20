document.addEventListener("DOMContentLoaded", () => {
  // Ensure default Super Admin exists
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const hasSuper = users.some(u => u.role === "superadmin" && u.username === "superadmin");

  if (!hasSuper) {
    users.unshift({
      id: 1,
      name: "Super Admin",
      email: "admin@system.com",
      username: "superadmin",
      password: "Super@123",
      mobile: "970599999999",
      restaurant: "Main Restaurant",
      role: "superadmin"
    });
    localStorage.setItem("users", JSON.stringify(users));
  }

  const loginForm = document.getElementById("loginForm");
  const identifier = document.getElementById("loginIdentifier");
  const password = document.getElementById("loginPassword");

  const identifierError = document.getElementById("identifierError");
  const passwordError = document.getElementById("passwordError");

  // Toggle password (your HTML uses id="togglePassword")
  const toggle = document.getElementById("togglePassword");
  if (toggle) {
    toggle.addEventListener("click", () => {
      password.type = password.type === "password" ? "text" : "password";
    });
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    identifierError.textContent = "";
    passwordError.textContent = "";

    const idVal = identifier.value.trim();
    const passVal = password.value;

    if (!idVal) {
      identifierError.textContent = "Username or Email required";
      return;
    }
    if (!passVal) {
      passwordError.textContent = "Password required";
      return;
    }

    users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.username === idVal || u.email === idVal);
    if (!user) {
      identifierError.textContent = "User not found";
      return;
    }

    if (user.password !== passVal) {
      passwordError.textContent = "Incorrect password";
      return;
    }

    // Save login session
    localStorage.setItem("currentUser", JSON.stringify({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant
    }));

  window.location.href = "index.html";
  });
});