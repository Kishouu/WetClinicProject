document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userData = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role: document.getElementById("role").value,
        fullName: document.getElementById("fullName").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
    };

    if (userData.username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return;
    }

    if (!userData.email.includes("@")) {
        alert("Invalid email address.");
        return;
    }

    if (userData.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Registration failed:", error);
        alert("An error occurred.");
    }

});
async function registerUser(userData) {
    try {
        const response = await fetch("http://localhost:3001/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.status === 409) {
            alert("Username is already taken. Please choose a different one.");
        } else if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Registration failed:", error);
        alert("An error occurred.");
    }
}
