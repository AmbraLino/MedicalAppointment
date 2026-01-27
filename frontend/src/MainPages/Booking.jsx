import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/booking/doctor-schedule/${state.docId}`, {
        ...formData,
        preferredDate: state.selectedDate,
        preferredTime: state.selectedTime
      });
      alert("Booking submitted!");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <button type="submit">Book</button>
    </form>
  );
};

export default Booking;
