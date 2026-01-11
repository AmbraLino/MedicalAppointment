// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../Images/barkea_logo_transparent.png";
// import { Carousel } from "react-bootstrap";
// import home1 from "../Images/home1.jpg";
// import home22 from "../Images/home22.jpg";
// import vilaPushimi1 from "../Images/vilaPushimi1.jpg";
// import "./Login.css"; 

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const nav = useNavigate();

//   // const handleLogin = async () => {
//   //   try {
//   //     const res = await axios.post(
//   //       "http://localhost:5000/login",
//   //       { email, password },
//   //       { withCredentials: true }
//   //     );
//   //     if (res.data.role === "admin") nav("/create");
//   //     else nav("/");
//   //   } catch (err) {
//   //     setError("Kredenciale te gabuara, problem ne server");
//   //   }
//   // };

//   const handleLogin = async () => {
//   try {
//     const res = await axios.post("http://localhost:5000/login", {
//       email,
//       password,
//     });

//     const { token,username, email: userEmail, role } = res.data;

//     sessionStorage.setItem("token", token);
//     sessionStorage.setItem("user", JSON.stringify({ username, email: userEmail, role }));

//     nav("/"); 
//   } catch (err) {
//     setError("Kredenciale të gabuara ose problem në server.");
//   }
// };


//   return (
    
//     <div className='login-full-container'>
//     <div className="login-container">
//       <div className="login-form">
//         {/* <div className="login-brand">
//           <img src={logo} width="180" height="80" alt="logo" />
//         </div> */}

//         <h2>Hyr</h2>
//         <p className="login-subtitle">Ju lutem plotësoni të dhënat tuaja për të hyrë në llogari.</p>

//         <label>Email *</label>
//         <input
//           type="text"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Shkruani adresën e email-it"
//         />

//         <label>Fjalëkalimi *</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Shkruani fjalëkalimin"
//         />

//         <div className="login-options">
//           <a href="/forgot" className="forgot-password">Harruat fjalëkalimin?</a>
//         </div>

//         {error && <p className="error">{error}</p>}

//         <button onClick={handleLogin}>Hyr</button>

//         <p className="login-signup-text">
//          Nuk keni llogari?{" "}
//           <a href="/register" className="login-register">Regjistrohu</a>
//         </p>
//       </div>
//       <div className="login-carousel">
//         {/* <Carousel fade indicators={false} controls={false} interval={2500}> */}
//         <Carousel fade indicators={false}>
//           {[home1, home22, vilaPushimi1].map((photo, index) => (
//             <Carousel.Item key={index}>
//               <img src={photo} className="d-block w-100" alt={`Slide ${index + 1}`} />
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Login;

//--------------------------------------------------------------------------------------------

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Carousel } from "react-bootstrap";
// import logo from "../Images/barkea_logo_transparent.png";
// import home1 from "../Images/home1.jpg";
// import home22 from "../Images/home22.jpg";
// import vilaPushimi1 from "../Images/vilaPushimi1.jpg";
// import "./Login.css";
// import { UserContext } from "../Auth/UserContext"; 

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { setUserInfo } = useContext(UserContext);

//   const handleLogin = async () => {
//       if (!email || !password) {
//     setError("Ju lutem plotësoni email dhe fjalëkalimin");
//     return;
//   }
//   try {
//     const loginRes = await axios.post(
//       "http://localhost:5000/user/login",
//       { email, password },
//       { withCredentials: true }
//     );

//     const userRes = await axios.get("http://localhost:5000/user", {
//       withCredentials: true,
//     });

//     setUserInfo(userRes.data);

//     if (userRes.data.role === "agent") navigate("/agentPanel");
//     else if (userRes.data.role === "admin") navigate("/adminPanel");
//     else navigate("/");
//   } catch (err) {
//     setError("Kredenciale të gabuara ose problem në server.");
//   }
// };
//     // Agent check
// //     if (
// //       userRes.data.role === "agent" &&
// //       userRes.data.email === "agjent@barkea.com"
// //     ) {
// //       navigate("/agjent"); // redirect agent
// //     } else if (userRes.data.role === "admin") {
// //       navigate("/adminPanel"); // redirect admin
// //     } else {
// //       navigate("/"); // normal user
// //     }
// //   } catch (err) {
// //     setError("Kredenciale të gabuara ose problem në server.");
// //   }
// // };


//   return (
//     <div className="login-full-container">
//       <div className="login-container">
//         <div className="login-form">
//           <h2>Hyr</h2>
//           <p className="login-subtitle">
//             Ju lutem plotësoni të dhënat tuaja për të hyrë në llogari.
//           </p>

//           <label>Email *</label>
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Shkruani adresën e email-it"
//           />

//           <label>Fjalëkalimi *</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Shkruani fjalëkalimin"
//           />

//           <div className="login-options">
//             <a href="/forgot" className="forgot-password">
//               Harruat fjalëkalimin?
//             </a>
//           </div>

//           {error && <p className="error">{error}</p>}

//           <button onClick={handleLogin}>Hyr</button>

//           <p className="login-signup-text">
//             Nuk keni llogari?{" "}
//             <a href="/register" className="login-register">
//               Regjistrohu
//             </a>
//           </p>
//         </div>

//         <div className="login-carousel">
//           <Carousel fade indicators={false}>
//             {[home1, home22, vilaPushimi1].map((photo, index) => (
//               <Carousel.Item key={index}>
//                 <img
//                   src={photo}
//                   className="d-block w-100"
//                   alt={`Slide ${index + 1}`}
//                 />
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-bootstrap";
// Importet e imazheve
// import logo from "../Images/barkea_logo_transparent.png";
// import home1 from "../Images/home1.jpg";
// import home22 from "../Images/home22.jpg";
// import vilaPushimi1 from "../Images/vilaPushimi1.jpg";
import "./Login.css";
import { UserContext } from "../Auth/UserContext"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserInfo } = useContext(UserContext);

    const handleLogin = async () => {
  if (!email || !password) {
    setError("Ju lutem plotësoni email dhe fjalëkalimin");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/user/login",
      { email, password },
      { withCredentials: true }
    );
    const userRes = await axios.get("http://localhost:5000/user", { withCredentials: true });
    setUserInfo(userRes.data);

    if (userRes.data.role === "agent") {
      navigate("/agjentPanel");
    } else if (userRes.data.role === "admin") {
      navigate("/adminPanel");
    } else {
      navigate("/");
    }

  } catch (err) {
    setError("Kredenciale të gabuara ose problem në server.");
  }
};


    return (
        <div className="login-full-container">
            <div className="login-container">
                <div className="login-form">
                    <h2>Hyr</h2>
                    <p className="login-subtitle">
                        Ju lutem plotësoni të dhënat tuaja për të hyrë në llogari.
                    </p>

                    <label>Email *</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Shkruani adresën e email-it"
                    />

                    <label>Fjalëkalimi *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Shkruani fjalëkalimin"
                    />

                    <div className="login-options">
                        <a href="/forgot" className="forgot-password">
                            Harruat fjalëkalimin?
                        </a>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button onClick={handleLogin}>Hyr</button>

                    <p className="login-signup-text">
                        Nuk keni llogari?{" "}
                        <a href="/register" className="login-register">
                            Regjistrohu
                        </a>
                    </p>
                </div>

                <div className="login-carousel">
                    {/* <Carousel fade indicators={false}>
                        {[home1, home22, vilaPushimi1].map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    src={photo}
                                    className="d-block w-100"
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel> */}
                </div>
            </div>
        </div>
    );
};

export default Login;