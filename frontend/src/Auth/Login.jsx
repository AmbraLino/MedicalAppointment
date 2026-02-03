import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import "./Login.css";
import { UserContext } from "../Auth/UserContext"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserInfo } = useContext(UserContext);

   const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
                        const { data } = await axios.post(
                "http://localhost:5000/user/login",
                { email, password },
                { withCredentials: true }
            );

            //  Vendosim user ne state
            setUserInfo(data);
            if (data.role === "admin") {
                navigate("/admin/create", { replace: true });
            } else if (data.role === "doctor") {
                navigate("/doctor/doctorDashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Email or password is incorrect.");
        }
    };

    return (
        <div className="login-full-container">
            <div className="login-container">
                <div className="login-form">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">ProHealth Portal</h2>
                        <p className="login-subtitle">
                            Welcome! Please log in to access your account.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@example.com"
                            required
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                        />

                        <div className="login-options d-flex justify-content-between">
                            <div>
                                <input type="checkbox" id="remember" /> 
                                <label htmlFor="remember" className="ms-1 shadow-none">Remember me</label>
                            </div>
                            <a href="/forgot" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        {error && <div className="alert alert-danger p-2 mt-2" style={{fontSize: '14px'}}>{error}</div>}

                        <button type="submit" className="login-btn mt-3">Log in</button>
                    </form>

                    <p className="login-signup-text mt-4">
                        Don't have an account?{" "}
                        <a href="/register" className="login-register fw-bold">
                            Register as a Patient
                        </a>
                    </p>
                </div>

                <div className="login-carousel">
                    <Carousel fade indicators={true} controls={false} interval={3000}>
                        <Carousel.Item>
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
                                className="d-block w-100"
                                alt="Medical 1"
                            />
                            <Carousel.Caption className="carousel-overlay">
                                <h3>Medical care 24/7</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                src="https://images.unsplash.com/photo-1505751172107-5739259ba485?auto=format&fit=crop&q=80&w=1000"
                                className="d-block w-100"
                                alt="Medical 2"
                            />
                            <Carousel.Caption className="carousel-overlay">
                                <h3>Latest Technology</h3>
                                <p>Advanced medical equipment for better care.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Login;