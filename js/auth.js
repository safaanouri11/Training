document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Access Control: Super Admin Only
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "superadmin") {
    window.location.href = "login.html";
  }

  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const strengthLine = document.getElementById("strengthLine");
  const matchLine = document.getElementById("matchLine");

  // Toggle Password Visibility
  window.togglePassword = function(id){
    const field = document.getElementById(id);
    field.type = field.type === "password" ? "text" : "password";
  }

  // Password Strength & Match Indicator
  passwordInput.addEventListener("input", updateStrength);
  confirmInput.addEventListener("input", updateMatch);

  function updateStrength(){
    const val = passwordInput.value;
    let score = 0;
    if(val.length>4) score++;
    if(/[A-Z]/.test(val)) score++;
    if(/[a-z]/.test(val)) score++;
    if(/\d/.test(val)) score++;
    if(/[\W_]/.test(val)) score++;
    // Set color
    if(score<=2) strengthLine.style.background="red";
    else if(score<=4) strengthLine.style.background="orange";
    else strengthLine.style.background="green";
  }

  function updateMatch(){
    if(confirmInput.value===passwordInput.value && confirmInput.value!=="") matchLine.style.background="green";
    else matchLine.style.background="red";
  }

  // Form Validation
  function validateForm(name,email,username,password,confirmPassword,prefix,mobile,restaurant){
    let isValid=true;
    document.querySelectorAll(".error").forEach(e=> e.textContent="");

    if(!name){document.getElementById("nameError").textContent="Full Name required"; isValid=false;}
    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){document.getElementById("emailError").textContent="Invalid Email"; isValid=false;}
    if(!username.match(/^[a-zA-Z0-9._-]+$/)){document.getElementById("usernameError").textContent="Invalid Username"; isValid=false;}
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/)){document.getElementById("passwordError").textContent="Weak Password"; isValid=false;}
    if(password!==confirmPassword){document.getElementById("confirmError").textContent="Passwords do not match"; isValid=false;}
    if(!prefix || !/^59\d{7}$/.test(mobile)){document.getElementById("mobileError").textContent="Invalid Mobile"; isValid=false;}
    if(!restaurant){document.getElementById("restaurantError").textContent="Restaurant required"; isValid=false;}

    return isValid;
  }

  // Form Submission
  form.addEventListener("submit", function(e){
    e.preventDefault();

    const name=document.getElementById("fullName").value.trim();
    const email=document.getElementById("email").value.trim();
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value;
    const confirmPassword=document.getElementById("confirmPassword").value;
    const prefix=document.getElementById("prefix").value;
    const mobile=document.getElementById("mobile").value.trim();
    const restaurant=document.getElementById("restaurant").value.trim();

    if(!validateForm(name,email,username,password,confirmPassword,prefix,mobile,restaurant)) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Unique Email/Username
    if(users.find(u=>u.email===email)){document.getElementById("emailError").textContent="Email already exists"; return;}
    if(users.find(u=>u.username===username)){document.getElementById("usernameError").textContent="Username already exists"; return;}

    // Add Admin
    users.push({
      id: users.length+1,
      name,
      email,
      username,
      password,
      mobile: prefix+mobile,
      restaurant,
      role:"admin"
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Admin Created Successfully!");
    form.reset();
    strengthLine.style.background="#ccc";
    matchLine.style.background="#ccc";
  });

});