document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registrationForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const userIdentifier = document.getElementById("userIdentifier").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userIdentifier, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem("user", JSON.stringify(result.user)); // Store session user
                    window.location.href = "home.html"; // Redirect after login success
                } else {
                    alert("Login failed: " + result.message);
                }
            } catch (error) {
                alert("An error occurred. Try again.");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const userData = {
                username: document.getElementById("username").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("regPassword").value.trim(),
                fullName: document.getElementById("fullName").value.trim(),
                phoneNumber: document.getElementById("phoneNumber").value.trim(),
            };

            try {
                const response = await fetch("/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem("user", JSON.stringify(result.user)); // Store session user
                    window.location.href = "home.html"; // Redirect after registration success
                } else {
                    alert("Registration failed: " + result.message);
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("An error occurred. Check console logs.");
            }
        });
    }
});
