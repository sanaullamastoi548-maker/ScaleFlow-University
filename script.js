// ==========================================
// 1. Selecting DOM Elements
// ==========================================
const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const signUpFormBox = document.getElementById('signUpFormBox');
const loginFormBox = document.getElementById('loginFormBox');
const goToLogin = document.getElementById('goToLogin');
const goToSignUp = document.getElementById('goToSignUp');

// ==========================================
// 2. Toggle Between Login & Sign Up Forms
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
// 3. Registration Form Submission Handler
// ==========================================
document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  // Student record object for database/sheets
  const studentRecord = {
    Student_ID: "STD_" + Math.floor(10000 + Math.random() * 90000),
    Full_Name: email.split('@')[0],
    Email: email,
    Password: password,
    Join_Date: new Date().toISOString().split('T')[0],
    Status: "Active",
    Role: "Student"
  };

  console.log("Registered:", studentRecord);
  openDashboard(email);
});

// ==========================================
// 4. Login Form Submission Handler
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  openDashboard(email);
});

// ==========================================
// 5. Direct Email / Google Connect Handler
// ==========================================
document.getElementById('googleConnectBtn').addEventListener('click', function() {
  openDashboard("user.email@scaleflow.com");
});

// ==========================================
// 6. Open Dashboard Function
// ==========================================
function openDashboard(email) {
  userEmailDisplay.innerText = "Logged in as: " + email;
  authContainer.style.display = 'none';
  mainDashboard.style.display = 'flex';
}

// ==========================================
// 7. Logout Handler
// ==========================================
logoutBtn.addEventListener('click', () => {
  mainDashboard.style.display = 'none';
  authContainer.style.display = 'flex';
});
