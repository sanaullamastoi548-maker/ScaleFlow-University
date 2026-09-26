
/* ==========================================
   SCALEFLOW UNIVERSITY
   Google Sheets API Connection
========================================== */

// 1. Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbzdH0bUgSTh_V17hLTOxU4PYM73Cn1NrEjUDBKKfDiUXRrwm5w4rugDkzmnHFLzrG5Wdg/exec";

// 2. DOM Elements
const authContainer = document.getElementById("authContainer");
const mainDashboard = document.getElementById("mainDashboard");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailDisplay = document.getElementById("userEmailDisplay");

const signUpFormBox = document.getElementById("signUpFormBox");
const loginFormBox = document.getElementById("loginFormBox");
const goToLogin = document.getElementById("goToLogin");
const goToSignUp = document.getElementById("goToSignUp");

const regForm = document.getElementById("regForm");
const loginForm = document.getElementById("loginForm");
const googleConnectBtn = document.getElementById("googleConnectBtn");

// 3. Session Storage Key
const TOKEN_KEY = "scaleflow_session_token";

// ==========================================
// 4. API Request Function
// ==========================================
async function apiRequest(action, data = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: action,
      ...data
    })
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed. Please try again.");
  }

  return result;
}

// ==========================================
// 5. Toggle Login / Sign Up Forms
// ==========================================
if (goToLogin) {
  goToLogin.addEventListener("click", () => {
    signUpFormBox.style.display = "none";
    loginFormBox.style.display = "block";
    authContainer.classList.add("active-login");
  });
}

if (goToSignUp) {
  goToSignUp.addEventListener("click", () => {
    loginFormBox.style.display = "none";
    signUpFormBox.style.display = "block";
    authContainer.classList.remove("active-login");
  });
}

// ==========================================
// 6. Registration Handler
// ==========================================
if (regForm) {
  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    const submitBtn = regForm.querySelector('[type="submit"]');

    try {
      if (submitBtn) submitBtn.disabled = true;

      const result = await apiRequest("register", {
        Email: email,
        email: email,
        Password: password,
        password: password,
        Full_Name: email.split("@")[0],
        Status: "Active",
        Role: "Student",
        Join_Date: new Date().toISOString().split("T")[0]
      });

      if (result.token) {
        localStorage.setItem(TOKEN_KEY, result.token);
      }

      alert(result.message || "Registration successful!");

      if (result.token) {
        openDashboard(email);
      } else {
        // If registration does not create a session,
        // switch to Login so the user can sign in.
        goToLogin?.click();
      }

      regForm.reset();

    } catch (error) {
      alert("Registration failed: " + error.message);
      console.error("Registration error:", error);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ==========================================
// 7. Login Handler
// ==========================================
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const submitBtn = loginForm.querySelector('[type="submit"]');

    try {
      if (submitBtn) submitBtn.disabled = true;

      const result = await apiRequest("login", {
         const result = await apiRequest("login", {
        Email: email,
        email: email,
        Password: password,
        password: password
      });

      if (!result.token) {
        throw new Error("Login token was not returned by the server.");
      }

      localStorage.setItem(TOKEN_KEY, result.token);

      openDashboard(result.user?.Email || result.user?.email || email);
      loginForm.reset();

      alert(result.message || "Login successful!");

    } catch (error) {
      alert("Login failed: " + error.message);
      console.error("Login error:", error);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ==========================================
// 8. Google Connect Button
// ==========================================
// This button does not perform Google OAuth.
// A real Google sign-in requires OAuth setup.
if (googleConnectBtn) {
  googleConnectBtn.addEventListener("click", () => {
    alert("Google Sign-In is not connected yet. Please use Email and Password.");
  });
}

// ==========================================
// 9. Open Dashboard
// ==========================================
function openDashboard(email) {
  if (userEmailDisplay) {
    userEmailDisplay.innerText = "Logged in as: " + email;
  }

  if (authContainer) authContainer.style.display = "none";
  if (mainDashboard) mainDashboard.style.display = "flex";
}

// ==========================================
// 10. Logout Handler
// ==========================================
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      if (token) {
        await apiRequest("logout", { token: token });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);

      if (mainDashboard) mainDashboard.style.display = "none";
      if (authContainer) authContainer.style.display = "flex";

      if (loginFormBox) loginFormBox.style.display = "block";
      if (signUpFormBox) signUpFormBox.style.display = "none";
      if (authContainer) authContainer.classList.add("active-login");
    }
  });
}

// ==========================================
// 11. Restore Dashboard on Page Reload
// ==========================================
(async function restoreSession() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return;

  try {
    const result = await apiRequest("me", { token: token });

    if (result.user) {
      const email = result.user.Email || result.user.email;

      if (email) {
        openDashboard(email);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    console.warn("Session could not be restored:", error);
  }
})();
