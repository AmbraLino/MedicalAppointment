import React, { useState, useEffect, useContext, useCallback } from "react";
import { Container, Row, Col, Card, Button, Table, ListGroup } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import { UserContext } from "../Auth/UserContext";
import {
  FiGrid, FiCalendar, FiMessageSquare, FiUsers, FiBell, FiSettings, FiSearch, FiCheck, FiX, FiHelpCircle, FiPlus, FiUsers as FiUsersGroup
} from "react-icons/fi";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./DoctorDashboard.css";
import OverviewTab from "./OverviewTab";
import CalendarTab from "./CalendarTab";
import NotificationsTab from "./NotificationsTab";
import Reviews from "../MainPages/Reviews";
const localizer = momentLocalizer(moment);

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const { userInfo } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");

  const doctorImage = userInfo?.image
    ? (userInfo.image.startsWith('http') ? userInfo.image : `http://localhost:5000/${userInfo.image}`)
    : "";

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/booking/doctor-list", { withCredentials: true });
      setAppointments(response.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së rezervimeve:", err);
    }
  }, []);

  useEffect(() => {
    if (userInfo?._id || userInfo?.id) fetchAppointments();
  }, [userInfo, fetchAppointments]);

  const handleStatusUpdate = async (id, newStatus, inputPrice) => {
    if (newStatus === 'approved') {
      if (!inputPrice || inputPrice.trim() === "" || parseFloat(inputPrice) <= 0) {
        alert("Ju lutem vendosni një çmim të vlefshëm për vizitën përpara se ta aprovoni!");
        return;
      }
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/booking/update/${id}`,
        { status: newStatus, cost: inputPrice },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        setAppointments(prev => prev.map(app => app._id === id ? response.data : app));
        alert("Statusi u përditësua dhe çmimi u dërgua te pacienti!");
      }
    } catch (error) {
      console.error("Gabim gjatë update-it:", error);
      alert("Ndodhi një gabim gjatë përditësimit.");
    }
  };
  const [doctorReviews, setDoctorReviews] = useState([]);
  const fetchReviews = useCallback(async () => {
    if (!userInfo?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${userInfo._id}`);
      setDoctorReviews(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së vlerësimeve:", err);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchAppointments();
    fetchReviews();
  }, [userInfo, fetchAppointments, fetchReviews]);

  const parseAppointmentDates = (app) => {
    if (!app.preferredDate) return { start: new Date(), end: new Date() };

    const formattedDateStr = app.preferredDate.replaceAll("/", "-");
    const appointmentDate = new Date(formattedDateStr);

    const timeParts = app.preferredTime ? app.preferredTime.split(/[: ]/) : ["09", "00", "AM"];
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10) || 0;
    const ampm = timeParts[2];

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    appointmentDate.setHours(hours, minutes, 0);

    const endDate = new Date(appointmentDate);
    endDate.setHours(endDate.getHours() + 1);

    return {
      start: appointmentDate,
      end: endDate
    };
  };

  const handleMarkAsViewed = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/booking/update-viewed/${id}`,
        { isViewed: true },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setAppointments(prev =>
          prev.map(app => app._id === id ? { ...app, isViewed: true } : app)
        );
      }
    } catch (error) {
      console.error("Gabim gjatë përditësimit të njoftimit:", error);
      setAppointments(prev =>
        prev.map(app => app._id === id ? { ...app, isViewed: true } : app)
      );
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar-container">
        <div className="sidebar-logo">
          <span className="logo-text">Pro <span className="logo-blue">Health</span></span>
        </div>
        <nav className="sidebar-nav">

          <button onClick={() => setActiveTab("overview")} className={`nav-item-btn ${activeTab === "overview" ? "active" : ""}`}><FiGrid className="nav-icon" /> Overview</button>
          <button onClick={() => setActiveTab("calendar")} className={`nav-item-btn ${activeTab === "calendar" ? "active" : ""}`}><FiCalendar className="nav-icon" /> Calendar</button>
                    <button onClick={() => setActiveTab("notifications")} className={`nav-item-btn ${activeTab === "notifications" ? "active" : ""}`}><FiBell className="nav-icon" /> Notifications</button>

          <button onClick={() => setActiveTab("reviews")} className={`nav-item-btn ${activeTab === "reviews" ? "active" : ""}`}>
            <FiMessageSquare className="nav-icon" /> Reviews
          </button>
          </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <Container fluid className="p-4">

          {/* TOPBAR / HEADER */}

          <div className="d-flex justify-content-between align-items-center mb-4 topbar-container">
            <div>
              <h2 className="fw-bold mb-0 text-dark">
                {activeTab === "overview" && (userInfo ? `Welcome, Dr. ${userInfo.username}` : "Welcome")}
                {activeTab === "calendar" && "Calendar & Schedule"}
                {/* {activeTab === "patients" && "Patients"} */}
                {activeTab === "notifications" && "Notification"}
              </h2>
              <p className="text-muted small mb-0">Check the later updates on your account!</p>
            </div>

            {/* Search Box - I mbështjellë me div korrekt */}
            <div className="search-box">
              <div className="input-group">
                <span className="input-group-text bg-white border-0">
                  <FiSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Profil Widget */}
            <div className="profile-widget d-flex align-items-center gap-3">
              {userInfo ? (
                <>
                  <div className="text-end d-none d-md-block">
                    <p className="profile-name mb-0 fw-bold">Dr. {userInfo.username}</p>
                    <small className="profile-role text-muted">{userInfo.specialty}</small>
                  </div>
                  <img
                    src={doctorImage}
                    alt="Doctor Profile"
                    style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </>
              ) : (
                <span className="text-muted small">Loading...</span>
              )}
            </div>
          </div>


          {/* --- MENAXHIMI DINAMIK I TABS --- */}
          {activeTab === "overview" && userInfo && (
            <OverviewTab
              appointments={appointments.filter(app =>
                app.fullName.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              handleStatusUpdate={handleStatusUpdate}
              date={date}
              setDate={setDate}
              doctorId={userInfo._id}
              reviews={doctorReviews}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarTab
              localizer={localizer}
              appointments={appointments}
              parseAppointmentDates={parseAppointmentDates}
              currentCalendarDate={currentCalendarDate}
              currentView={currentView}
              setCurrentCalendarDate={setCurrentCalendarDate}
              setCurrentView={setCurrentView}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              appointments={appointments}
              handleMarkAsViewed={handleMarkAsViewed}
            />
          )}

         {activeTab === "reviews" && userInfo?._id && (
  <div className="reviews-section">
    {/* Ky komponent Reviews tani merr ID-në e doktorit që është i loguar */}
    <Reviews doctorId={userInfo._id} />
  </div>
)}

          {/* 2. TAB: CALENDAR (LËVIZ DHE SHFAQ VETËM REZERVIMET REAL-TIME) */}


          {/* 3. TAB: MESSAGES */}


          {/* 4. TAB: PATIENTS */}

          {/* 5. TAB: NOTIFICATIONS */}


          {/* 6. TAB: SETTINGS */}


        </Container>
      </main>
    </div>
  );
};

export default DoctorDashboard;