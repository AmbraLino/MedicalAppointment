// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Department.css";
// import { FaCalendarAlt,FaStethoscope, FaHeart,FaBrain , FaEye} from "react-icons/fa";


// const Department = () => {
//   const { id } = useParams(); 
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchDoctors = async () => {
// //       try {
// //         const res = await axios.get(`http://localhost:5000/user/doctors/${id}`);
// //         setDoctors(res.data);
// //       } catch (err) {
// //         console.error("Gabim gjatë marrjes së doktorëve:", err);
// //       }
// //     };
// //     fetchDoctors();
// //   }, [id]);

//     const department=[
//       {
//         id:"emergency",
//         icon: <FaCalendarAlt />,
//         title: "Emergency Department",
//       },
//       {
//         id:"pediatric",
//         icon: <FaStethoscope />,
//         title: "Pediatric Department",
//       },
//       {
//         id:"cardiology",
//         icon: <FaHeart/>,
//         title: "Cardiology Department",
//       },
//       {
//         id:"ophthalmology",
//         icon: <FaEye/>,
//         title: "Ophthalmology Department",
//       },
//       {
//         id:"neurology",
//         icon: <FaBrain/>,
//         title: "Neurology Department",
//       },
//     ];

//   return (
// //     <div className="container py-5">
// // <h2 className="text-center mb-5 fw-bold text-uppercase">
// //   Departamenti: {id.replace(/([A-Z])/g, ' $1').trim()} 
// // </h2>      
// //       <div className="row">
// //         {doctors.length > 0 ? (
// //           doctors.map((doc) => (
// //             <div className="col-md-4 mb-4" key={doc._id}>
// //               <div className="card h-100 shadow-sm border-0 p-3 text-center">
// //                 {/* Supozojmë se doktori ka një foto, përndryshe përdorim ikonë */}
// //                 <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
// //                    <span style={{fontSize: "2rem"}}>👨‍⚕️</span>
// //                 </div>
// //                 <h4>Dr. {doc.username}</h4>
// //                 <p className="text-muted">{doc.experience || "10+"} vite eksperiencë</p>
// //                 <div className="d-flex justify-content-center gap-2 mb-3">
// //                   <span className="badge bg-info">{doc.email}</span>
// //                 </div>
// //                 <button 
// //                   className="btn btn-primary rounded-pill"
// //                   onClick={() => navigate(`/book-appointment/${doc._id}`)}
// //                 >
// //                   Rezervo Vizitë
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-center">Nuk u gjet asnjë doktor për këtë departament aktualisht.</p>
// //         )}
// //       </div>
//       <div className="dept-section container text-center py-5">
//   <div className="dept-header mb-5">
//     <p className="dept-subtitle">OUR DEPARTMENTS</p>
//     <h2 className="dept-main-title">For Your Health</h2>
//   </div>

//   <div className="department-wrapper">
//     {department.map((item, index) => (
//       <div key={index} className="dept-item" onClick={() => navigate(`/department/${item.id}`)}
//       style={{ cursor: 'pointer' }} 
//     >
//         <div className="dept-icon-box">{item.icon}</div>
//         <div className="dept-text-content">
//           <h3 className="dept-title">{item.title}</h3>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
//   );
// };

// export default Department;



import React, { useState } from 'react';
import './Department.css';

const Department = () => {
  // Te dhenat per reviews (mund t'i marresh nga API ne MERN)
  const reviewsData = [
    {
      id: 1,
      name: "PAULO HUBERT",
      location: "New York, USA",
      comment: "I recently had to bring my child to the hospital for a minor injury. The staff was very professional and quick.",
      rating: 5
    },
    {
      id: 2,
      name: "LAURENCE VENDETTA",
      location: "California, USA",
      comment: "The care we received was exceptional. From the reception to the doctors, everyone made us feel at ease.",
      rating: 4
    },
    {
      id: 3,
      name: "CASSANDRA RAUL",
      location: "Rome",
      comment: "Very clean facilities and very short waiting times. I highly recommend this hospital for any emergency.",
      rating: 5
    }
  ];

  const [activeReview, setActiveReview] = useState(reviewsData[0]);

  const departments = [
    { name: "Emergency Department", icon: "🚨" },
    { name: "Pediatric Department", icon: "👶" },
    { name: "Obstetrics and Gynecology", icon: "🏥" },
    { name: "Cardiology Department", icon: "🫀" },
    { name: "Neurology Department", icon: "🧠" },
    { name: "Psychiatry Department", icon: "🧬" },
  ];

  return (
    <div className="hospital-container">
      {/* DEPARTMENTS */}
      <section className="departments-section">
        <div className="blue-header-bg">
          <h2>Departments</h2>
        </div>
        <div className="dept-grid">
          {departments.map((dept, index) => (
            <div key={index} className="dept-card">
              <span className="dept-icon">{dept.icon}</span>
              <p>{dept.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2>SOME REVIEWS</h2>
          <p className="subtitle">OF OUR CLIENTS</p>
        </div>

        <div className="reviews-content">
          {/* Lista e personave majtas */}
          <div className="users-list">
            {reviewsData.map((user) => (
              <div 
                key={user.id} 
                className={`user-item ${activeReview.id === user.id ? 'active-user' : ''}`}
                onClick={() => setActiveReview(user)}
              >
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <small>{user.location}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Paneli i komentit djathtas */}
          <div className="testimonial-box">
            <div className="rating-badge">Rating: {activeReview.rating}/5</div>
            <span className="quote-mark">“</span>
            <p className="fade-in" key={activeReview.id}>
              {activeReview.comment}
            </p>
            <div className="stars">
              {"★".repeat(activeReview.rating)}{"☆".repeat(5 - activeReview.rating)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Department;