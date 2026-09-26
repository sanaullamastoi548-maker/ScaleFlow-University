
/****************************************************
 * SCALEFLOW UNIVERSITY
 * GOOGLE SHEETS AUTHENTICATION
 * Register | Login | Logout | Session
 ****************************************************/

// 1. GOOGLE APPS SCRIPT URL
const API_URL = "https://script.google.com/macros/s/AKfycbzdH0bUgSTh_V17hLTOxU4PYM73Cn1NrEjUDBKKfDiUXRrwm5w4rugDkzmnHFLzrG5Wdg/exec";

// 2. SESSION TOKEN KEY
const TOKEN_KEY = "scaleflow_session_token";

// ==========================================
// 3. INITIALIZE AFTER HTML LOADS
// ==========================================
document.addEventListener("DOMContentLoaded", function () {

  // DOM ELEMENTS
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

  const regFullName = document.getElementById("regFullName");
  const regEmail = document.getElementById("regEmail");
  const regPassword = document.getElementById("regPassword");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  // ==========================================
  // 4. CHECK REQUIRED HTML ELEMENTS
  // ==========================================
  if (!authContainer || !regForm || !loginForm) {
    console.error(
      "ScaleFlow Error: Required HTML elements are missing. Check authContainer, regForm and loginForm IDs."
    );
  }

  // ==========================================
  // 5. API REQUEST
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
        "Server response is invalid. Please check Apps Script deployment."
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message || "Server error: " + response.status
      );
    }

    if (result.status === "error" || result.success === false) {
      throw new Error(
        result.message || "Request failed. Please try again."
      );
    }

    return result;
  }

  // ==========================================
  // 6. SHOW LOGIN FORM
  // ==========================================
  function showLoginForm() {
    if (signUpFormBox) {
      signUpFormBox.style.display = "none";
    }

    if (loginFormBox) {
      loginFormBox.style.display = "block";
    }

    if (authContainer) {
      authContainer.classList.add("active-login");
    }
  }

  // ==========================================
  // 7. SHOW REGISTRATION FORM
  // ==========================================
  function showSignUpForm() {
    if (loginFormBox) {
      loginFormBox.style.display = "none";
    }

    if (signUpFormBox) {
      signUpFormBox.style.display = "block";
    }

    if (authContainer) {
      authContainer.classList.remove("active-login");
    }
  }

  // ==========================================
  // 8. TOGGLE LOGIN / SIGNUP
  // ==========================================
  if (goToLogin) {
    goToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      showLoginForm();
    });
  }

  if (goToSignUp) {
    goToSignUp.addEventListener("click", function (e) {
      e.preventDefault();
      showSignUpForm();
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
  // 10. REGISTRATION
  // ==========================================
  if (regForm) {
    regForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fullName = regFullName ? regFullName.value.trim() : "";
      const email = regEmail ? regEmail.value.trim() : "";
      const password = regPassword ? regPassword.value : "";

      const submitBtn = regForm.querySelector('[type="submit"]');

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

        const result = await apiRequest("register", {
          fullName: fullName,
          email: email,
          password: password
        });

        console.log("REGISTRATION RESPONSE:", result);

        if (!result.token) {
          throw new Error(
            result.message || "Registration did not return a session token."
          );
        }

        localStorage.setItem(TOKEN_KEY, result.token);

        const studentEmail = result.student?.Email || email;

        openDashboard(studentEmail);
        regForm.reset();

        alert(result.message || "Registration successful!");

      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Register";
        }
      }
    });
  }

  // ==========================================
  // 11. LOGIN
  // ==========================================
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = loginEmail ? loginEmail.value.trim() : "";
      const password = loginPassword ? loginPassword.value : "";

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

        const result = await apiRequest("login", {
          email: email,
          password: password
        });

        console.log("LOGIN RESPONSE:", result);

        if (!result.token) {
          throw new Error(
            result.message || "Login did not return a session token."
          );
        }

        localStorage.setItem(TOKEN_KEY, result.token);

        const studentEmail = result.student?.Email || email;

        openDashboard(studentEmail);
        loginForm.reset();

        alert(result.message || "Login successful!");

      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Login";
        }
      }
    });
  }

  // ==========================================
  // 12. GOOGLE CONNECT BUTTON
  // ==========================================
  if (googleConnectBtn) {
    googleConnectBtn.addEventListener("click", function (e) {
      e.preventDefault();

      alert(
        "Google Sign-In is not connected yet. Please use Email and Password."
      );
    });
  }

  // ==========================================
  // 13. LOGOUT
  // ==========================================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();

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

        showLoginForm();
      }
    });
  }

  // ==========================================
  // 14. RESTORE SESSION
  // ==========================================
  async function restoreSession() {
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
  }

  restoreSession();

});
