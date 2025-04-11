// Login.jsx
import React from "react";

const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username or Email" />
                <br />
                <input type="password" placeholder="Password" />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
