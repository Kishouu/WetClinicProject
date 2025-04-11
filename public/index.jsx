import React from "react";

const App = () => {
    return (
        <div>
            <h1>Welcome to WetClinic</h1>
            <div className="buttons">
                <button onClick={() => (window.location.href = "/auth/login")}>Login</button>
                <button onClick={() => (window.location.href = "/auth/register")}>Register</button>
            </div>
        </div>
    );
};

export default App;
