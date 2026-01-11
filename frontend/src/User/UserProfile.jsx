import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Auth/UserContext";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const { userInfo, setUserInfo, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    profilePic: ""
  });
  const [preview, setPreview] = useState("");

  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        profilePic: userInfo.profilePic || ""
      });
      setPreview(userInfo.profilePic || "");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
const res = await axios.get("http://localhost:5000/order/my", { withCredentials: true });
        setReservations(res.data);
      } catch (err) {
        console.error("Error loading reservations:", err);
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchReservations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/user", formData, {
        withCredentials: true
      });
      setUserInfo(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-profile-wrapper">
      <div className="profile-column">
        <h2>My Profile</h2>
        <form className="user-profile-form" onSubmit={handleSubmit}>
          <div className="profile-picture-wrapper">
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt="Profile"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div className="reservations-column">
        <h2>My Reservations</h2>

        {loadingReservations ? (
          <p>Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <div className="reservations-placeholder">
            No reservations yet.
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map((resv) => (
              <div className="reservation-card" key={resv._id}>
                <h3>{resv.product?.name || "Property"}</h3>
                <p><strong>Date:</strong> {resv.date}</p>
                <p><strong>Time:</strong> {resv.time}</p>
                <p>
                  <strong>Status:</strong> 
                  <span
                    className={`status-tag ${
                      resv.status === "Pranuar"
                        ? "accepted"
                        : resv.status === "Refuzuar"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {resv.status}
                  </span>
                </p>
                {resv.agent && <p><strong>Agent:</strong> {resv.agent.username}</p>}
                {resv.message && <p><strong>Agent Message:</strong> {resv.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
