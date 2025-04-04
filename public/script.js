document.addEventListener("DOMContentLoaded", function () {
    function showSection(section) {
        document.getElementById("login").style.display = section === "login" ? "block" : "none";
        document.getElementById("register").style.display = section === "register" ? "block" : "none";
    }

    // Ensure buttons exist before adding event listeners
    const loginButton = document.querySelector(".nav-buttons button:nth-child(1)");
    const registerButton = document.querySelector(".nav-buttons button:nth-child(2)");

    if (loginButton && registerButton) {
        loginButton.addEventListener("click", () => showSection("login"));
        registerButton.addEventListener("click", () => showSection("register"));
    } else {
        console.error("Login/Register buttons not found.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    function showSection(section) {
        document.getElementById("login").style.display = section === "login" ? "block" : "none";
        document.getElementById("register").style.display = section === "register" ? "block" : "none";
    }

    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const userIdentifier = document.getElementById("userIdentifier").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIdentifier, password }),
            });

            const result = await response.json();
            console.log("Login response:", result);

            if (response.ok) {
                window.location.href = "home.html"; // Redirecting to home
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            alert("An error occurred. Try again.");
        }
    });

    document.getElementById("registrationForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const userData = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("regPassword").value.trim(),
            fullName: document.getElementById("fullName").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
        };

        console.log("Sending registration request:", userData); // Debugging output

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            console.log("Server response:", result); // Debugging output

            if (response.ok) {
                window.location.href = "home.html"; // Redirecting to home
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert("An error occurred. Check console logs.");
        }
    });
});
