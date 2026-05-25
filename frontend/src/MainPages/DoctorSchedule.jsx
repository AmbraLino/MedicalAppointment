import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorSchedule.css";

const DoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/booking/doctor-schedule/${id}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.log("Error fetching appointments:", err));
  }, [id]);

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleMonthChange = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDay(null); // Reset selected day when month changes
  };

  const handleSlotClick = (hour) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    navigate("/booking", { 
      state: { 
        selectedDate: formattedDate, 
        selectedTime: hour, 
        docId: id 
      } 
    });
  };

  return (
    <div className="calendar-container shadow-sm rounded border p-4">
      <h2 className="text-center mb-4">Book an Appointment</h2>

      {/* Month Navigation */}
      <div className="month-nav d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-primary" onClick={() => handleMonthChange(-1)}>
          Previous Month
        </button>
        <h3 className="mb-0 text-capitalize">
          {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button className="btn btn-outline-primary" onClick={() => handleMonthChange(1)}>
          Next Month
        </button>
      </div>

      {/* Days Selection Grid */}
      <div className="days-grid mb-5">
        <h5 className="mb-3">Select a Day:</h5>
        <div className="d-flex flex-wrap gap-2">
          {daysArray.map(day => (
            <button
              key={day}
              className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ width: '45px', height: '45px', fontWeight: 'bold' }}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots Section (Conditional Rendering) */}
      {selectedDay && (
        <div className="time-slots-section animate-in">
          <h5 className="mb-3">
            Available Slots for {currentDate.toLocaleString('en-US', { month: 'long' })} {selectedDay}, {year}:
          </h5>
          <div className="list-group">
            {hours.map(hour => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
              const app = appointments.find(a => a.preferredDate === dateStr && a.preferredTime === hour);
              
              const isOccupied = app?.status === 'approved' || app?.status === 'pending';

              return (
                <button
                  key={hour}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isOccupied ? 'disabled bg-light' : ''}`}
                  onClick={() => !isOccupied && handleSlotClick(hour)}
                  style={{ cursor: isOccupied ? 'not-allowed' : 'pointer' }}
                >
                  <span style={{ fontWeight: '500' }}>{hour}</span>
                  <span className={`badge rounded-pill ${isOccupied ? 'bg-danger' : 'bg-success'}`}>
                    {isOccupied ? "Occupied" : "Available"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;