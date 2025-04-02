document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const userIdentifier = document.getElementById("userIdentifier").value.trim();
    const password = document.getElementById("password").value.trim();

    if (userIdentifier.length < 3) {
        alert("Please enter a valid email or username.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIdentifier, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            // Redirect user to dashboard or homepage here
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("An error occurred.");
    }
});
