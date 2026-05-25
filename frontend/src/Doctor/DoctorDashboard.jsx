import React, { useState, useEffect, useContext, useCallback } from "react";
import { Container, Row, Col, Card, Button, Table, ListGroup } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import { UserContext } from "../Auth/UserContext";
import {
  FiGrid, FiCalendar, FiMessageSquare, FiUsers,
  FiBell, FiSettings, FiSearch, FiCheck, FiX, FiHelpCircle, FiPlus, FiUsers as FiUsersGroup
} from "react-icons/fi";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./DoctorDashboard.css";

// Konfigurimi i lokalizuesit të kohës për Kalendarin e Madh
const localizer = momentLocalizer(moment);

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const { userInfo } = useContext(UserContext);

  // --- GJENDJET E REJA PËR TË LEJUAR NAVIGIMIN E KALENDARIT ---
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");

  // Default avatars në rast se nuk ka foto në databazë
  const defaultDoctorAvatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
  const defaultPatientAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Marrja e rezervimeve automatikisht nga Databaza për doktorin e loguar
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

  // Përditësimi i statusit (Aprovim/Refuzim) dhe vendosja e kostos dinamike
  const handleStatusUpdate = async (id, newStatus) => {
    let costValue = 0;
    if (newStatus === 'approved') {
      const inputCost = prompt("Vendos koston e vizitës ($):");
      if (inputCost === null || inputCost.trim() === "") return;
      costValue = parseFloat(inputCost);
      if (isNaN(costValue)) { alert("Ju lutem vendosni një numër të saktë!"); return; }
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/booking/update/${id}`,
        { status: newStatus, cost: costValue },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        setAppointments(prev => prev.map(app => app._id === id ? response.data : app));
        alert("Statusi u përditësua me sukses!");
      }
    } catch (error) {
      console.error("Gabim gjatë update-it:", error);
    }
  };

  // Funksion ndihmës për të kthyer stringun e preferredDate dhe preferredTime në Objekt saktë Date
  const parseAppointmentDates = (app) => {
    if (!app.preferredDate) return { start: new Date(), end: new Date() };

    // Sigurohemi që formati të lexohet saktë (Zëvendëson "/" me "-" nëse është e nevojshme)
    const formattedDateStr = app.preferredDate.replaceAll("/", "-");
    const appointmentDate = new Date(formattedDateStr);
    
    // Nxjerrim orën dhe minutat nga stringu preferredTime (Psh: "09:30 AM" ose "11:00 AM")
    const timeParts = app.preferredTime ? app.preferredTime.split(/[: ]/) : ["09", "00", "AM"];
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10) || 0;
    const ampm = timeParts[2];
    
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    appointmentDate.setHours(hours, minutes, 0);
    
    // Kohëzgjatja e takimit vendoset automatikisht 1 orë
    const endDate = new Date(appointmentDate);
    endDate.setHours(endDate.getHours() + 1);

    return {
      start: appointmentDate,
      end: endDate
    };
  };
  // Funksioni për të shënuar njoftimin si të parë (Viewed)
const handleMarkAsViewed = async (id) => {
  try {
    // 1. Thirrja në Backend për të ndryshuar statusin e shikueshmërisë në databazë
    const response = await axios.patch(
      `http://localhost:5000/booking/update-viewed/${id}`, // Sigurohu që ky rrugëtim (route) ekziston në backend
      { isViewed: true },
      { withCredentials: true }
    );

    if (response.status === 200 || response.status === 201) {
      // 2. Përditësojmë gjendjen në frontend që të pasqyrohet ndryshimi menjëherë
      setAppointments(prev => 
        prev.map(app => app._id === id ? { ...app, isViewed: true } : app)
      );
    }
  } catch (error) {
    console.error("Gabim gjatë përditësimit të njoftimit:", error);
    
    // FALLBACK (Nëse nuk ke akoma rrugëtim në backend, le ta bëjmë ndryshimin vetëm në frontend për provë):
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
          <span className="logo-text">MediSync <span className="logo-blue">Pro</span></span>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab("overview")} className={`nav-item-btn ${activeTab === "overview" ? "active" : ""}`}><FiGrid className="nav-icon" /> Overview</button>
          <button onClick={() => setActiveTab("calendar")} className={`nav-item-btn ${activeTab === "calendar" ? "active" : ""}`}><FiCalendar className="nav-icon" /> Calendar</button>
          <button onClick={() => setActiveTab("messages")} className={`nav-item-btn ${activeTab === "messages" ? "active" : ""}`}><FiMessageSquare className="nav-icon" /> Messages</button>
          <button onClick={() => setActiveTab("patients")} className={`nav-item-btn ${activeTab === "patients" ? "active" : ""}`}><FiUsers className="nav-icon" /> Patients</button>
          <button onClick={() => setActiveTab("notifications")} className={`nav-item-btn ${activeTab === "notifications" ? "active" : ""}`}><FiBell className="nav-icon" /> Notification</button>
          <button onClick={() => setActiveTab("settings")} className={`nav-item-btn ${activeTab === "settings" ? "active" : ""}`}><FiSettings className="nav-icon" /> Settings</button>
        </nav>
        <div className="sidebar-footer">
          <a href="#help" className="nav-item-footer"><FiHelpCircle /> Need Help?</a>
        </div>
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
                {activeTab === "messages" && "Messages"}
                {activeTab === "patients" && "Patients"}
                {activeTab === "notifications" && "Notification"}
                {activeTab === "settings" && "Account Settings"}
              </h2>
              <p className="text-muted small mb-0">Check the later updates on your account!</p>
            </div>
            <div className="d-flex align-items-center gap-4">
              <div className="icon-actions d-flex gap-3">
                <button className="action-circle-btn"><FiSearch /></button>
                <button className="action-circle-btn"><FiBell /><span className="badge-dot"></span></button>
              </div>

              {/* Profil Widget */}
              <div className="profile-widget d-flex align-items-center gap-3">
                {userInfo ? (
                  <>
                    <img
                      src={userInfo.image || userInfo.profilePicture || userInfo.avatar || userInfo.imageUrl || defaultDoctorAvatar}
                      alt="Doctor Profile"
                      className="avatar-main"
                      onError={(e) => { e.target.src = defaultDoctorAvatar; }}
                    />
                    <div className="text-start d-none d-md-block">
                      <p className="profile-name mb-0">Dr. {userInfo.username}</p>
                      <small className="profile-role">{userInfo.specialty || userInfo.department || "Medical Specialist"}</small>
                    </div>
                  </>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    <span className="text-muted small">Loading Profile...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- MENAXHIMI DINAMIK I TABS --- */}

          {/* 1. TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <Row>
              <Col lg={8}>
                <Row className="mb-4 g-3">
                  <Col md={3}><Card className="stat-card shadow-sm border-0"><Card.Body><p className="stat-title">Online Consultation</p><div className="d-flex justify-content-between align-items-baseline"><h2 className="stat-number">{appointments.filter(a => a.consultationType === 'online').length}</h2><span className="stat-link">view all</span></div></Card.Body></Card></Col>
                  <Col md={3}><Card className="stat-card shadow-sm border-0"><Card.Body><p className="stat-title">Offline Consultation</p><div className="d-flex justify-content-between align-items-baseline"><h2 className="stat-number">{appointments.filter(a => a.consultationType === 'offline').length}</h2><span className="stat-link">view all</span></div></Card.Body></Card></Col>
                  <Col md={3}><Card className="stat-card shadow-sm border-0"><Card.Body><p className="stat-title">Satisfied Patients</p><div className="d-flex justify-content-between align-items-baseline"><h2 className="stat-number text-indigo">{230 + appointments.filter(a => a.status === 'approved').length}+</h2><span className="stat-link">view all</span></div></Card.Body></Card></Col>
                  <Col md={3}><Card className="stat-card shadow-sm border-0"><Card.Body><p className="stat-title">Patients per month</p><div className="d-flex justify-content-between align-items-baseline"><h2 className="stat-number text-dark-blue">{appointments.length}</h2><span className="stat-link">view all</span></div></Card.Body></Card></Col>
                </Row>

                <Row className="g-4">
                  <Col md={7}>
                    <Card className="content-card border-0 shadow-sm p-3">
                      <h5 className="section-title mb-3">Last Notifications</h5>
                      <ListGroup variant="flush" className="scrollable-list">
                        {appointments.filter(a => a.status === 'pending').map(app => (
                          <ListGroup.Item key={app._id} className="notification-item py-3 border-0 border-bottom">
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={app.user?.image || defaultPatientAvatar}
                                alt="Patient"
                                className="avatar-sub me-3"
                                onError={(e) => { e.target.src = defaultPatientAvatar; }}
                              />
                              <div>
                                <h6 className="mb-0 fw-bold item-name">{app.fullName}</h6>
                                <small className="text-muted extra-small">{app.phoneNumber}</small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2 bg-light p-2 rounded">
                              <span className="time-badge">{app.preferredTime}</span>
                              <div className="d-flex gap-2">
                                <Button size="sm" variant="success" className="btn-action-round" onClick={() => handleStatusUpdate(app._id, 'approved')}><FiCheck /></Button>
                                <Button size="sm" variant="outline-danger" className="btn-action-round" onClick={() => handleStatusUpdate(app._id, 'rejected')}><FiX /></Button>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  </Col>

                  <Col md={5}>
                    <Card className="content-card border-0 shadow-sm p-3">
                      <h5 className="section-title mb-3">Patients</h5>
                      <div className="scrollable-list">
                        {appointments.slice(0, 5).map((app, index) => (
                          <div key={index} className="patient-row-item d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={app.user?.image || defaultPatientAvatar}
                                alt="Patient"
                                className="avatar-sub-patient"
                                onError={(e) => { e.target.src = defaultPatientAvatar; }}
                              />
                              <h6 className="mb-0 small fw-bold">{app.fullName}</h6>
                            </div>
                            <Button size="sm" variant="primary" className="btn-check-patient">Check Patient</Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <Card className="schedule-side-card border-0 shadow-sm p-3 h-100 sticky-card">
                  <h5 className="section-title mb-3">Your Schedule</h5>
                  <div className="calendar-box mb-3"><Calendar onChange={setDate} value={date} className="custom-calendar" /></div>
                  <h6 className="timeline-section-title small mb-3">TODAY'S TIMELINE</h6>
                  <div className="timeline-container-list">
                    {appointments.filter(a => a.status === 'approved').map((app, i) => (
                      <div key={i} className="timeline-card-item d-flex mb-3">
                        <div className="timeline-left-indicator">
                          <span className="timeline-time-text">{app.preferredTime}</span>
                          <div className="line-node"><div className="node-dot"></div></div>
                        </div>
                        <div className="timeline-right-body flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="appointment-type-title mb-1">Consultation</h6>
                              <p className="appointment-patient-name mb-0">{app.fullName}</p>
                            </div>
                            <span className="appointment-cost-badge">{app.cost}$ <span className="cost-label">Cost</span></span>
                          </div>
                          <div className="mt-2"><span className="badge-confirmed-indicator"><span className="green-bullet"></span> Confirmed</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          {/* 2. TAB: CALENDAR (LËVIZ DHE SHFAQ VETËM REZERVIMET REAL-TIME) */}
          {activeTab === "calendar" && (
            <Card className="border-0 shadow-sm p-4 content-card animate__animated animate__fadeIn">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Doctor's Live Schedule</h5>
                  <small className="text-muted">Working hours limited to: 09:00 AM - 03:00 PM</small>
                </div>
              </div>
              
              <div className="calendar-interaktive-holder" style={{ height: "650px", background: "#fff" }}>
                <BigCalendar
                  localizer={localizer}
                  
                  // Ngarkojmë rezervimet nga databaza
                  events={appointments
                    .filter(app => app.status === 'approved') 
                    .map(app => {
                      const parsedDates = parseAppointmentDates(app);
                      return {
                        id: app._id,
                        title: `${app.consultationType === 'online' ? '🌐 Online' : '🏥 In-Clinic'}: ${app.fullName}`,
                        start: parsedDates.start,
                        end: parsedDates.end,
                        resource: app
                      };
                    })
                  }
                  startAccessor="start"
                  endAccessor="end"
                  
                  // --- KONTROLLI I INTEGRUAR QË MUNDËSON NAVIGIMIN ---
                  date={currentCalendarDate}
                  view={currentView}
                  onNavigate={(newDate) => setCurrentCalendarDate(newDate)}
                  onView={(newView) => setCurrentView(newView)}
                  
                  views={['month', 'week', 'day']}
                  
                  // Kufizojmë kolonat vertikale vetëm nga ora 9:00 deri në 15:00 (3 PM)
                  min={new Date(new Date().setHours(9, 0, 0))}
                  max={new Date(new Date().setHours(15, 0, 0))}
                  
                  // --- STILIMI I SAKTI: Ditët e lira zbrazët, ngjyra vetëm te blloku i rezervimit ---
                  slotPropGetter={() => ({
                    style: { backgroundColor: "#ffffff" } // Detyn çdo kuti të zbrazët të rrijë e bardhë standarde
                  })}
                  
                  eventPropGetter={(event) => {
                    const isOnline = event.resource.consultationType === 'online';
                    return {
                      style: {
                        backgroundColor: isOnline ? '#e1f5fe' : '#e8f5e9', // Vetëm rezervimi merr ngjyrën
                        color: isOnline ? '#0288d1' : '#2e7d32',
                        borderLeft: isOnline ? '5px solid #0288d1' : '5px solid #2e7d32',
                        borderRadius: '6px',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        fontSize: '12px',
                        padding: '4px',
                        fontWeight: '600'
                      }
                    };
                  }}
                />
              </div>
            </Card>
          )}

          {/* 3. TAB: MESSAGES */}
          {activeTab === "messages" && (
            <div className="messages-layout-container d-flex gap-4 animate__animated animate__fadeIn">
              {/* Seksioni i Video Call */}
              <div className="video-call-section flex-grow-1 position-relative bg-dark rounded-4 overflow-hidden shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '550px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" 
                  alt="Patient Video Feed" 
                  className="w-100 h-100 object-fit-cover position-absolute top-0 start-0 opacity-75"
                />
                <div className="doctor-mini-preview position-absolute bg-white p-1 rounded-3 shadow-sm overflow-hidden" style={{ width: '120px', height: '90px', right: '20px', bottom: '90px', zIndex: 10 }}>
                  <img src={userInfo?.image || defaultDoctorAvatar} alt="Doctor" className="w-100 h-100 object-fit-cover rounded-2" onError={(e) => { e.target.src = defaultDoctorAvatar; }} />
                </div>
                <div className="video-controls-bar position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3 bg-white px-4 py-2 rounded-pill shadow-lg" style={{ zIndex: 5 }}>
                  <button className="control-circle-btn text-muted border-0 bg-transparent"><FiSearch /></button>
                  <button className="control-circle-btn text-muted border-0 bg-transparent"><FiCalendar /></button>
                  <button className="control-circle-btn bg-danger text-white border-0 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '50%' }}><FiX size={20} /></button>
                  <button className="control-circle-btn text-muted border-0 bg-transparent"><FiUsersGroup /></button>
                  <button className="control-circle-btn text-muted border-0 bg-transparent"><FiMessageSquare /></button>
                </div>
              </div>

              {/* Seksioni i Chat Box anësor */}
              <div className="chat-box-section bg-white rounded-4 shadow-sm p-3 d-flex flex-column" style={{ width: '380px', height: '550px' }}>
                <div className="chat-header d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                  <img src={defaultPatientAvatar} className="avatar-sub" alt="Patient" />
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Active Patient</h6>
                    <small className="text-success small">● Online Session</small>
                  </div>
                </div>
                <div className="chat-messages-body flex-grow-1 overflow-y-auto mb-3 p-2 bg-light rounded-3" style={{ fontSize: '13px', maxHeight: '360px' }}>
                  <div className="message-bubble patient-msg mb-3 bg-white p-2 rounded-3 text-muted shadow-sm" style={{ maxWidth: '80%' }}>
                    Hello Doctor, I wanted to review my test values from yesterday.
                    <small className="d-block text-end extra-small mt-1 text-muted">12:42 PM</small>
                  </div>
                  <div className="message-bubble doctor-msg mb-3 bg-primary text-white p-2 rounded-3 shadow-sm ms-auto" style={{ maxWidth: '80%', textAlign: 'left' }}>
                    Sure, let's take a look together during our video call.
                    <small className="d-block extra-small text-white-50 mt-1 text-end">12:50 PM</small>
                  </div>
                </div>
                <div className="chat-input-footer d-flex gap-2 align-items-center border-top pt-2">
                  <input type="text" className="form-control form-control-sm rounded-pill px-3 border-0 bg-light" placeholder="Type a message..." />
                  <Button size="sm" variant="primary" className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                    <FiMessageSquare size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 4. TAB: PATIENTS */}
          {activeTab === "patients" && (
            <Card className="border-0 shadow-sm p-4 content-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0">{appointments.length} Patients Total</h5>
                <div className="d-flex gap-2">
                  <select className="form-select form-select-sm rounded-pill px-3" style={{ width: '130px' }}>
                    <option>All Patients</option>
                  </select>
                  <Button size="sm" variant="primary" className="rounded-pill px-3 d-flex align-items-center gap-1">
                    <FiPlus /> Add new patient
                  </Button>
                </div>
              </div>
              <Table responsive hover className="patients-table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Doctor Assigned</th>
                    <th>Conditions</th>
                    <th>Next Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={app.user?.image || defaultPatientAvatar}
                            alt="Patient"
                            className="avatar-sub-patient"
                            onError={(e) => { e.target.src = defaultPatientAvatar; }}
                          />
                          <span className="fw-bold text-dark small">{app.fullName}</span>
                        </div>
                      </td>
                      <td className="text-muted small">{app.user?.email || "N/A"}</td>
                      <td className="small fw-semibold text-dark">
                        Dr. {userInfo?.username || "Assigned"}
                      </td>
                      <td className="text-muted small">{app.consultationType === 'online' ? 'Flu / Online' : 'Fracture / Offline'}</td>
                      <td>
                        <Button size="sm" variant="success" className="btn-schedule-table">Schedule Appointment</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {/* 5. TAB: NOTIFICATIONS */}
          {/* 5. TAB: NOTIFICATIONS */}
{activeTab === "notifications" && (
  <Card className="border-0 shadow-sm p-4 content-card">
    {/* Pjesa e sipërme e header-it të njoftimeve mbetet e njëjtë */}
    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
      <div className="d-flex gap-2 align-items-center">
        <Button variant="light" size="sm" className="rounded-pill px-3">&lt; Today &gt;</Button>
      </div>
      <div className="d-flex gap-3 align-items-center">
        <div className="tab-filters d-flex bg-light rounded-pill p-1">
          <span className="px-3 py-1 small rounded-pill bg-white shadow-sm text-primary fw-bold">Week</span>
          <span className="px-3 py-1 small text-muted">Month</span>
          <span className="px-3 py-1 small text-muted">Year</span>
        </div>
      </div>
    </div>

    <h5 className="section-title mb-4">Last Notifications</h5>
    <div className="notifications-page-list">
      {appointments.map((app) => (
        <div key={app._id} className={`notification-full-card p-3 mb-3 border rounded-3 bg-white shadow-sm ${app.isViewed ? 'opacity-75 bg-light' : ''}`}>
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex gap-2">
              {/* Ndryshon ngjyrën e pikës nëse është parë apo jo */}
              <div className={app.isViewed ? "gray-bullet-dot mt-1" : "blue-bullet-dot mt-1"}></div>
              <div>
                <h6 className={`fw-bold mb-1 ${app.isViewed ? 'text-muted' : 'text-dark'}`}>
                  {app.status === 'pending' ? 'Appointment Request' : 'Confirmed Appointment'}
                </h6>
                <p className="text-muted small mb-3">Patient has requested an appointment for consultation regarding specific healthcare tracking.</p>
              </div>
            </div>
            
            {/* --- BUTONI DINAMIK I NDRYSHUAR --- */}
            <Button 
              variant={app.isViewed ? "light" : "success"} 
              size="sm" 
              className={`btn-mark-viewed fw-semibold ${app.isViewed ? 'text-muted' : 'text-white'}`}
              onClick={() => handleMarkAsViewed(app._id)}
              disabled={app.isViewed} // E bën të paklikueshëm pasi është shtypur një herë
            >
              {app.isViewed ? "✓ Viewed" : "Mark as viewed"}
            </Button>
          </div>
          
          <Row className="g-2 bg-light p-3 rounded-3 mt-1 text-center">
            <Col xs={3}><small className="text-muted d-block text-start">Patient</small><span className="fw-bold d-block text-start small text-dark">{app.fullName}</span></Col>
            <Col xs={3}><small className="text-muted d-block text-start">Symptoms</small><span className="fw-bold d-block text-start small text-dark">General Checkup</span></Col>
            <Col xs={3}><small className="text-muted d-block text-start">Time</small><span className="fw-bold d-block text-start small text-dark">{app.preferredDate || "Today"} {app.preferredTime}</span></Col>
            <Col xs={3}><small className="text-muted d-block text-start">Phone</small><span className="fw-bold d-block text-start small text-dark">{app.phoneNumber}</span></Col>
          </Row>
        </div>
      ))}
    </div>
  </Card>
)}

          {/* 6. TAB: SETTINGS */}
          {activeTab === "settings" && (
            <Card className="border-0 shadow-sm p-4 content-card">
              <h5 className="fw-bold text-dark mb-3">Settings</h5>
              <p className="text-muted small">Manage your professional medical account profile, working hours, and password settings.</p>
            </Card>
          )}

        </Container>
      </main>
    </div>
  );
};

export default DoctorDashboard;