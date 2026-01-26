

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
        // Parandalojmë refresh-in e faqes nëse përdoret brenda një <form>
        if(e) e.preventDefault();

        if (!email || !password) {
            setError("Ju lutem plotësoni email dhe fjalëkalimin");
            return;
        }

        try {
            // 1. Thirrja e loginit
            await axios.post(
                "http://localhost:5000/user/login",
                { email, password },
                { withCredentials: true }
            );

            // 2. Marrja e të dhënave të përdoruesit pas loginit të suksesshëm
            const userRes = await axios.get("http://localhost:5000/user", { withCredentials: true });
            const user = userRes.data;
            
            setUserInfo(user);

            // 3. Ridrejtimi sipas Rolit (Këtu ndryshon logjika)
            if (user.role === "admin") {
                navigate("/adminPanel"); // Faqja e administratorit
            } else if (user.role === "doctor") {
                navigate("/doctorPanel"); // Faqja e doktorit (ish-agent)
            } else if (user.role === "patient" || user.role === "user") {
                navigate("/"); // Faqja kryesore për klientët
            } else {
                navigate("/"); // Default
            }

        } catch (err) {
            console.error(err);
            setError("Email ose fjalëkalim i gabuar. Provoni përsëri.");
        }
    };

    return (
        <div className="login-full-container">
            <div className="login-container">
                <div className="login-form">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">ProHealth Portal</h2>
                        <p className="login-subtitle">
                            Mirësevini! Hyni për të menaxhuar vizitat tuaja.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <label>Email Adresa</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="emri@shembull.com"
                            required
                        />

                        <label>Fjalëkalimi</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <div className="login-options d-flex justify-content-between">
                            <div>
                                <input type="checkbox" id="remember" /> 
                                <label htmlFor="remember" className="ms-1 shadow-none">Më mbaj mend</label>
                            </div>
                            <a href="/forgot" className="forgot-password">
                                Harruat fjalëkalimin?
                            </a>
                        </div>

                        {error && <div className="alert alert-danger p-2 mt-2" style={{fontSize: '14px'}}>{error}</div>}

                        <button type="submit" className="login-btn mt-3">Hyr në Llogari</button>
                    </form>

                    <p className="login-signup-text mt-4">
                        Nuk keni llogari?{" "}
                        <a href="/register" className="login-register fw-bold">
                            Regjistrohu si Pacient
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
                                <h3>Kujdes mjekësor 24/7</h3>
                                <p>Doktorët tanë janë këtu për ju në çdo kohë.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                src="https://images.unsplash.com/photo-1505751172107-5739259ba485?auto=format&fit=crop&q=80&w=1000"
                                className="d-block w-100"
                                alt="Medical 2"
                            />
                            <Carousel.Caption className="carousel-overlay">
                                <h3>Teknologjia e fundit</h3>
                                <p>Rezervoni terminin tuaj online me një klikim.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Login;