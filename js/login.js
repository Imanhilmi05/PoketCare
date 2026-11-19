
// POKETCARE LOGIN AUTHENTICATION

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// Hardcoded credentials
const validUsername = "admin";
const validPassword = "12345";

// Handle login
loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === validUsername && password === validPassword) {

        // Save login session
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);

        // Go to dashboard
        window.location.href = "dashboard.html";

    } else {

        // Display error
        errorMessage.classList.remove("d-none");

    }

});
