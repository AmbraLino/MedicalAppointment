import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { FaCalendarAlt,FaStethoscope, FaHeart,FaBrain , FaEye} from "react-icons/fa";
import home from "../Images/2home.jpg";
import home1 from "../Images/3home.jpg";
import "./Home.css";



const Home = () => {
  const navigate = useNavigate();
  // const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const cardsPerPage = 3;

  const rating = [
     {

      title: "20+",
      desc: "years of experience",
    },
    {
      title: "95%",
      desc: "patients satisfaction rating",
    },
    {
      title: "5,000+",
      desc: "patients served annually",
    },
    {
      title: "10+",
      desc: "healthcare providers on staff",
    },
   
  ];

  // const department=[
  //   {
  //     id:"emergency",
  //     icon: <FaCalendarAlt />,
  //     title: "Emergency Department",
  //   },
  //   {
  //     id:"pediatric",
  //     icon: <FaStethoscope />,
  //     title: "Pediatric Department",
  //   },
  //   {
  //     id:"cardiology",
  //     icon: <FaHeart/>,
  //     title: "Cardiology Department",
  //   },
  //   {
  //     id:"ophthalmology",
  //     icon: <FaEye/>,
  //     title: "Ophthalmology Department",
  //   },
  //   {
  //     id:"neurology",
  //     icon: <FaBrain/>,
  //     title: "Neurology Department",
  //   },
  // ];


  return (
  <div className="home-container" style={{ overflowX: 'hidden' }}>
     <div className="home-top d-flex flex-column justify-content-center align-items-center text-center" style={{ 
      backgroundImage: `url(${home})`, 
      backgroundSize: '100% 100%',     
      backgroundPosition: 'center 15%', 
      backgroundRepeat: 'no-repeat',
      width: '100%', 
      height: '80vh',                 
      color: 'white',
      margin: 0,
      padding: 0,
      display: 'flex'
    }}
> 

  <div className="home-top-text"> Your Partner in <br/>Health and Wellness </div> 
    <div className="home-text ">We are commited to providing you with best medical<br/> 
     and healthcare services to help you live healthier and happier <br/>
   </div>
  

  <div className="stats-overlay d-flex justify-content-around align-items-center">
    {rating.map((item, index) => (
            <div key={index} className="stat-item">
              <h2 className="stat-title">{item.title}</h2>
              <p className="stat-desc">{item.desc}</p>
            </div>
          ))}
  </div>
 </div>

 <div className="about-wrapper">
  <div className="about-content">
    <div className="home-about-title">ABOUT</div>
    <div className="home-about">ProHealth is a team of experienced medical professionals</div>
    <div className="home-about-desc">
      Dedicated to providing top-quality healthcare services.
      We believe in a holistic approach to healthcare that focuses on treating the whole person, not just the illness or symptoms.
    </div>
  </div>
  
  <div className="about-image">
    <img src={home1} alt="about in homepage" />
  </div>
</div>

<section class="our-values">
    <h2>Our Values</h2>
    <div class="values-container">
        
        <div className="value-card">
            <div className="icon"><span>❤</span></div>
            <h3>Compassion</h3>
            <p>We understand that seeking medical care can be a stressful and sensitive experience.</p>
        </div>

        <div className="value-card">
            <div className="icon"><span>⭐</span></div>
            <h3>Excellence</h3>
            <p>We are committed to providing superior medical care and service to our patients.</p>
        </div>

        <div className="value-card">
            <div className="icon"><span>🛡️</span></div>
            <h3>Integrity</h3>
            <p>We believe in practicing medicine with integrity and honesty.</p>
        </div>

        <div className="value-card">
            <div className="icon"><span>🤝</span></div>
            <h3>Respect</h3>
            <p>We treat all individuals with respect and dignity, regardless of their background.</p>
        </div>

        <div className="value-card">
            <div className="icon"><span>👥</span></div>
            <h3>Teamwork</h3>
            <p>We believe in working collaboratively with our team members.</p>
        </div>

    </div>
</section>

{/* <div className="dept-section container text-center py-5">
  <div className="dept-header mb-5">
    <p className="dept-subtitle">OUR DEPARTMENTS</p>
    <h2 className="dept-main-title">For Your Health</h2>
  </div>

  <div className="department-wrapper">
    {department.map((item, index) => (
      <div key={index} className="dept-item" onClick={() => navigate(`/department/${item.id}`)}
      style={{ cursor: 'pointer' }} 
    >
        <div className="dept-icon-box">{item.icon}</div>
        <div className="dept-text-content">
          <h3 className="dept-title">{item.title}</h3>
        </div>
      </div>
    ))}
  </div>
</div> */}
</div>

  )
};

export default Home;
