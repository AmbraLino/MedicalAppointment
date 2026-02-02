import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Auth/UserContext";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const { userInfo, setUserInfo, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "", email: "", phone: "", image: ""
  });
  const [preview, setPreview] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        image: userInfo.image || ""
      });
      setPreview(userInfo.image || "");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/booking/my", { withCredentials: true });
        setReservations(res.data);
      } catch (err) {
        console.error("Gabim gjatë ngarkimit:", err);
      } finally {
        setLoadingRes(false);
      }
    };
    fetchReservations();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("A jeni të sigurt që dëshironi të anuloni këtë rezervim?")) {
      try {
        // Thirrja e rrugës DELETE në Backend
        await axios.delete(`http://localhost:5000/booking/cancel/${bookingId}`, {
          withCredentials: true
        });

        // Përditësimi i listës në ekran (UI)
        setReservations(prev => prev.filter(item => item._id !== bookingId));
        alert("Rezervimi u anulua!");
      } catch (err) {
        console.error("Gabim gjatë fshirjes:", err);
        alert("Serveri u përgjigj me gabim. Sigurohu që Backend-i është i ndezur.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/user", formData, { withCredentials: true });
      setUserInfo(res.data);
      alert("Profili u përditësua!");
    } catch (err) {
      alert("Gabim gjatë ruajtjes.");
    }
  };

  if (loading) return <div className="loading">Duke u ngarkuar...</div>;

  return (
    <div className="user-profile-wrapper">
      <div className="profile-column">
        <h2>My Profile</h2>
        <form className="user-profile-form" onSubmit={handleSubmit}>
          <div className="profile-picture-wrapper">
            <img src={preview || "/default-avatar.png"} alt="Profile" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          <button type="submit" className="update-button">Update Profile</button>
        </form>
      </div>

      <div className="reservations-column">
        <h2>My Reservations</h2>
        {loadingRes ? (
          <p className="loading-msg">Duke ngarkuar rezervimet...</p>
        ) : reservations.length === 0 ? (
          <div className="reservations-placeholder">Nuk u gjet asnjë rezervim.</div>
        ) : (
          <div className="reservations-list">
            {reservations.map((item) => (
              <div key={item._id} className="reservation-card">
                <div className="res-header">
                  <h3>Dr. {item.doctor?.username || "I paemërtuar"}</h3>
                  <span className={`status-badge ${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
                <div className="res-details">
                  <p><strong>Data:</strong> {item.preferredDate}</p>
                  <p><strong>Ora:</strong> {item.preferredTime}</p>
                  <p><strong>Pacienti:</strong> {item.fullName}</p>
                  <button className="delete-res-btn" onClick={() => handleDeleteBooking(item._id)}>
                    Anulo Rezervimin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;