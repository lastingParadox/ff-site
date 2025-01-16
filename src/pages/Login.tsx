import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ username: null, password: null, login: null })

    const handleSubmit = (data: any) => {
        console.log('sorry nothing');
    }

    return (
        <main className="form-page">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Log in</h1>
                <div className="login-field">
                    <label htmlFor="username">
                        Username
                        <input type="email" className="login-input" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    {errors.username && <small className="error">{errors.username}</small>}
                </div>
                <div className="login-field">
                    <label htmlFor="password" className={`${errors.password ? " error" : ""}`}>
                        Password
                        <input type="password" className="login-input" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {errors.password && <small className="error">{errors.password}</small>}
                </div>
                {errors.login && <small className="error">{errors.login}</small>}
                <button type="submit" id="login" onClick={handleSubmit}>
                    Log in
                </button>
                <p id="register">
                    <Link to="/register">Need to register?</Link>
                </p>
            </form>
        </main>
    );
}