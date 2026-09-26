ل
/****************************************************
 * SCALEFLOW UNIVERSITY
 * GOOGLE SHEETS AUTHENTICATION
 * Register | Login | Logout | Session
 ****************************************************/

// 1. GOOGLE APPS SCRIPT URL
const API_URL = "https://script.google.com/macros/s/AKfycbzdH0bUgSTh_V17hLTOxU4PYM73Cn1NrEjUDBKKfDiUXRrwm5w4rugDkzmnHFLzrG5Wdg/exec";

// 2. DOM ELEMENTS
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

// Registration inputs
const regFullName = document.getElementById("regFullName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

// Login inputs
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

// 3. SESSION TOKEN KEY
const TOKEN_KEY = "scaleflow_session_token";

// ==========================================
// 4. API REQUEST FUNCTION
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

  let result;

  try {
    result = await response.json();
  } catch (error) {
    throw new Error(
      "Server returned an invalid response. Please check Apps Script deployment."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Server error: " + response.status
    );
  }

  if (
    result.status === "error" ||
    result.success === false
  ) {
    throw new Error(
      result.message || "Request failed. Please try again."
    );
  }

  return result;
}

// ==========================================
// 5. TOGGLE LOGIN / SIGNUP
// ==========================================
if (goToLogin) {
  goToLogin.addEventListener("click", () => {
    if (signUpFormBox) {
      signUpFormBox.style.display = "none";
    }

    if (loginFormBox) {
      loginFormBox.style.display = "block";
    }

    if (authContainer) {
      authContainer.classList.add("active-login");
    }
  });
}

if (goToSignUp) {
  goToSignUp.addEventListener("click", () => {
    if (loginFormBox) {
      loginFormBox.style.display = "none";
    }

    if (signUpFormBox) {
      signUpFormBox.style.display = "block";
    }

    if (authContainer) {
      authContainer.classList.remove("active-login");
    }
  });
}

// ==========================================
// 6. REGISTRATION HANDLER
// ==========================================
if (regForm) {
  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Read registration fields
    const fullName = regFullName?.value.trim() || "";
    const email = regEmail?.value.trim() || "";
    const password = regPassword?.value || "";

    const submitBtn = regForm.querySelector('[type="submit"]');

    // Validate required fields
    if (!fullName || !email || !password) {
      alert("Please enter your full name, email and password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Registering...";
      }

      // Send registration data to Apps Script
      const result = await apiRequest("register", {
        fullName: fullName,
        email: email,
        password: password
      });

      console.log("REGISTRATION API RESPONSE:", result);

      if (!result.token) {
        throw new Error(
          result.message ||
          "Registration response did not include a session token."
        );
      }

      // Save session token
      localStorage.setItem(TOKEN_KEY, result.token);

      // Get registered student email
      const studentEmail = result.student?.Email || email;

      // Open dashboard
      openDashboard(studentEmail);

      // Reset registration form
      regForm.reset();

      alert(result.message || "Registration successful!");

    } catch (error) {
      alert("Registration failed: " + error.message);
      console.error("Registration error:", error);

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
      }
    }
  });
}

// ==========================================
// 7. LOGIN HANDLER
// ==========================================
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = loginEmail?.value.trim() || "";
    const password = loginPassword?.value || "";

    const submitBtn = loginForm.querySelector('[type="submit"]');

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";
      }

      // Send login data
      const result = await apiRequest("login", {
        email: email,
        password: password
      });

      console.log("LOGIN API RESPONSE:", result);

      if (!result.token) {
        throw new Error(
          result.message ||
          "Login response did not include a session token."
        );
      }

      // Save session token
      localStorage.setItem(TOKEN_KEY, result.token);

      const studentEmail = result.student?.Email || email;

      // Open dashboard
      openDashboard(studentEmail);

      loginForm.reset();

      alert(result.message || "Login successful!");

    } catch (error) {
      alert("Login failed: " + error.message);
      console.error("Login error:", error);

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
      }
    }
  });
}

// ==========================================
// 8. GOOGLE CONNECT BUTTON
// ==========================================
if (googleConnectBtn) {
  googleConnectBtn.addEventListener("click", () => {
    alert(
      "Google Sign-In is not connected yet. Please use Email and Password."
    );
  });
}

// ==========================================
// 9. OPEN DASHBOARD
// ==========================================
function openDashboard(email) {
  if (userEmailDisplay) {
    userEmailDisplay.innerText = "Logged in as: " + email;
  }

  if (authContainer) {
    authContainer.style.display = "none";
  }

  if (mainDashboard) {
    mainDashboard.style.display = "block";
  }
}

// ==========================================
// 10. LOGOUT HANDLER
// ==========================================
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      if (token) {
        await apiRequest("logout", {
          token: token
        });
      }

    } catch (error) {
      console.error("Logout API error:", error);

    } finally {
      localStorage.removeItem(TOKEN_KEY);

      if (mainDashboard) {
        mainDashboard.style.display = "none";
      }

      if (authContainer) {
        authContainer.style.display = "flex";
      }

      if (loginFormBox) {
        loginFormBox.style.display = "block";
      }

      if (signUpFormBox) {
        signUpFormBox.style.display = "none";
      }

      if (authContainer) {
        authContainer.classList.add("active-login");
      }
    }
  });
}

// ==========================================
// 11. RESTORE SESSION
// ==========================================
(async function restoreSession() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return;
  }

  try {
    const result = await apiRequest("me", {
      token: token
    });

    if (result.student && result.student.Email) {
      openDashboard(result.student.Email);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    console.warn("Session could not be restored:", error);
  }
})();
