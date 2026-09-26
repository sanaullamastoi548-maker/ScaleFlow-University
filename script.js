// ==========================================
// 1. Configuration & Global Variables
// ==========================================
// آپ کا فراہم کردہ گوگل ایپس سکرپٹ Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdH0bUgSTh_V17hLTOxU4PYM73Cn1NrEjUDBKKfDiUXRrwm5w4rugDkzmnHFLzrG5Wdg/exec";

const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const signUpFormBox = document.getElementById('signUpFormBox');
const loginFormBox = document.getElementById('loginFormBox');
const goToLogin = document.getElementById('goToLogin');
const goToSignUp = document.getElementById('goToSignUp');

// ==========================================
// 2. UI Notification Helper (Success/Error Message)
// ==========================================
function showNotification(message, type = "success") {
  let notifBox = document.getElementById('customNotification');
  if (!notifBox) {
    notifBox = document.createElement('div');
    notifBox.id = 'customNotification';
    notifBox.style.position = 'fixed';
    notifBox.style.top = '20px';
    notifBox.style.right = '20px';
    notifBox.style.padding = '15px 25px';
    notifBox.style.borderRadius = '8px';
    notifBox.style.color = '#fff';
    notifBox.style.fontWeight = 'bold';
    notifBox.style.zIndex = '9999';
    notifBox.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notifBox.style.transition = 'all 0.3s ease';
    document.body.appendChild(notifBox);
  }

  notifBox.style.background = type === "success" ? "#28a745" : "#dc3545";
  notifBox.innerText = message;
  notifBox.style.display = 'block';

  setTimeout(() => {
    notifBox.style.display = 'none';
  }, 4000);
}

// ==========================================
// 3. Form Toggle Logic (Sign Up <-> Login)
// ==========================================
goToLogin.addEventListener('click', () => {
  signUpFormBox.style.display = 'none';
  loginFormBox.style.display = 'block';
  authContainer.classList.add('active-login');
});

goToSignUp.addEventListener('click', () => {
  loginFormBox.style.display = 'none';
  signUpFormBox.style.display = 'block';
  authContainer.classList.remove('active-login');
});

// ==========================================
// 4. Registration Submission (Sign Up)
// ==========================================
document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const submitBtn = e.target.querySelector('button');

  submitBtn.innerText = "Registering...";
  submitBtn.disabled = true;

  const payload = {
    action: "register",
    email: email,
    password: password,
    device: navigator.userAgent
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    submitBtn.innerText = "Register";
    submitBtn.disabled = false;

    if (response.status === "success") {
      showNotification(response.message, "success");
      openDashboard(response.data.email);
    } else {
      showNotification(response.message, "error");
    }
  })
  .catch(err => {
    submitBtn.innerText = "Register";
    submitBtn.disabled = false;
    showNotification("کنکشن کی خرابی! گوگل شیٹ سے رابطہ نہیں ہو سکا۔", "error");
    console.error(err);
  });
});

// ==========================================
// 5. Login Submission
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const submitBtn = e.target.querySelector('button');

  submitBtn.innerText = "Logging in...";
  submitBtn.disabled = true;

  const payload = {
    action: "login",
    email: email,
    password: password,
    device: navigator.userAgent
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    submitBtn.innerText = "Login";
    submitBtn.disabled = false;

    if (response.status === "success") {
      showNotification(response.message, "success");
      openDashboard(response.data.email);
    } else {
      showNotification(response.message, "error");
    }
  })
  .catch(err => {
    submitBtn.innerText = "Login";
    submitBtn.disabled = false;
    showNotification("کنکشن کی خرابی! گوگل شیٹ سے رابطہ نہیں ہو سکا۔", "error");
    console.error(err);
  });
});

// ==========================================
// 6. Direct Email Connect Button
// ==========================================
document.getElementById('googleConnectBtn').addEventListener('click', function() {
  showNotification("ڈائریکٹ ای میل لاگ ان جلد دستیاب ہوگا۔", "success");
});

// ==========================================
// 7. Dashboard Functions
// ==========================================
function openDashboard(email) {
  userEmailDisplay.innerText = "Logged in as: " + email;
  authContainer.style.display = 'none';
  mainDashboard.style.display = 'flex';
}

logoutBtn.addEventListener('click', () => {
  mainDashboard.style.display = 'none';
  authContainer.style.display = 'flex';
  showNotification("آپ کامیابی سے لاگ آؤٹ ہو چکے ہیں۔", "success");
});
