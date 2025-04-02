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

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "dashboard.html";
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
        role: document.getElementById("role").value,
        fullName: document.getElementById("fullName").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
    };

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "index.html";
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("An error occurred. Try again.");
    }
});
