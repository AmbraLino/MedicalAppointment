import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorSchedule.css";

const DoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/booking/doctor-schedule/${id}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.log("Gabim gjatë marrjes së takimeve:", err));
  }, [id]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  const handleSlotClick = (day, hour) => {
  navigate("/booking", { state: { selectedDate: day, selectedTime: hour, docId: id } });
};
  return (
    <div className="calendar-container shadow-sm rounded border">
      <h2 className="text-center mb-4">Doctor's Hours</h2>
      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className="day-column">
            <div className="day-header">{day}</div>
            {hours.map(hour => {
              const app = appointments.find(a => a.preferredDate === day && a.preferredTime === hour);
              const isOccupied = app?.status === 'approved';
              const isPending = app?.status === 'pending';

              return (
                <button
                  key={hour}
                  disabled={isOccupied || isPending}
                  className={`slot-btn ${isOccupied ? 'busy' : isPending ? 'pending' : 'free'}`}
                  onClick={() => handleSlotClick(day, hour)}
                >
                  <span className="slot-time">{hour}</span>
                  <span className="slot-label">
                    {isOccupied ? "Busy" : isPending ? "Pending" : "Lirë"}
                  </span>
                  {(isOccupied || isPending) && app?.fullName && (
                    <span className="patient-name-label">{app.fullName}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedule;