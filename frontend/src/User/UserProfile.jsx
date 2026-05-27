import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Auth/UserContext";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import "./UserProfile.css";
import ReviewModal from "../MainPages/ReviewModal";

// Direct Client ID configuration for the US Sandbox environment
const PAYPAL_CLIENT_ID = "AVgLq5mpEBS7C3pxog29lyGY3pW9WT0TKeFiWMAWrmod40FB4xUMpjYzxCsQnSkUl5Y2h3W-IubWjAlp";

const PayPalButtonComponent = ({ cost, bookingId, onSuccess, onCancel }) => {
  // Pastrimi i vlerës së çmimit
  let cleanCost = cost ? cost.toString().replace(/[^0-9.]/g, '') : "40.00";
  if (parseFloat(cleanCost) <= 0) cleanCost = "40.00";
  return (
    <div style={{ marginTop: "10px" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: "USD", value: cleanCost } }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(() => onSuccess(bookingId));
        }}
      />

      <button
        className="delete-res-btn"
        style={{ backgroundColor: "#6c757d", width: "100%", marginTop: "5px" }}
        onClick={onCancel}
      >
        Cancel Payment
      </button>
    </div>

  );
};

const UserProfile = () => {
  const { userInfo, setUserInfo, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    image: ""
  });
  const [preview, setPreview] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(true);

  const [activePaymentId, setActivePaymentId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
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
        const res = await axios.get(
          "http://localhost:5000/booking/my",
          { withCredentials: true }
        );
        setReservations(res.data);
      } catch (err) {
        console.error("Error while loading reservations:", err);
      } finally {
        setLoadingRes(false);
      }
    };
    fetchReservations();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await axios.put(
          `http://localhost:5000/booking/cancel/${bookingId}`,
          {},
          { withCredentials: true }
        );

        setReservations(prev =>
          prev.map(item => item._id === bookingId ? { ...item, status: "Cancelled by Patient" } : item)
        );
        alert("Reservation cancelled successfully!");
      } catch (err) {
        console.error("Error while cancelling reservation:", err);
        alert("Server error. Make sure the backend service is running.");
      }
    }
  };

  const handlePaymentSuccess = async (bookingId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/booking/pay/${bookingId}`,
        {},
        { withCredentials: true }
      );

      // Këtu marrim të dhënat e përditësuara që vijnë nga serveri
      const updatedBooking = res.data.booking || res.data;

      setReservations(prev =>
        prev.map(item => item._id === bookingId ? { ...item, ...updatedBooking } : item)
      );

      setActivePaymentId(null);
      alert("Pagesa u regjistrua me sukses!");
    } catch (err) {
      console.error("Backend error:", err);
      alert("Gabim gjatë lidhjes me serverin.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);

      if (formData.image instanceof File) {
        dataToSend.append("image", formData.image);
      }

      const res = await axios.put(
        "http://localhost:5000/user",
        dataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setUserInfo(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile payload sync error:", err);
      alert("Error encountered while updating user profile data.");
    }
  };

  if (loading) return <div className="loading">Loading profile content...</div>;

  const getImageSrc = () => {
    if (!preview) return null;
    if (preview.startsWith("blob:") || preview.startsWith("data:")) {
      return preview;
    }
    return `http://localhost:5000/Images/${preview}`;
  };

  const imageSrc = getImageSrc();
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AZsjFKZqLvSsAtx4bXuT0FyQADls9fVMI8HUirLsvvv8fPfT33V805l2TtQUUHB9QkwIVQSebABOj1uR",
        "currency": "USD",
        "intent": "capture"
      }}
    >
      <div className="user-profile-wrapper">
        <div className="profile-column">
          <h2>My Profile</h2>
          <form className="user-profile-form" onSubmit={handleSubmit}>

            <div className="profile-picture-container">
              <div className="profile-circle">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Profile Avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="avatar-initial">
                    {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <label htmlFor="file-upload" className="custom-file-upload">
                Select profile picture
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

            <button type="submit" className="update-button">
              Update Profile
            </button>
          </form>
        </div>

        <div className="reservations-column">
          <h2>My Reservations</h2>

          {loadingRes ? (
            <p className="loading-msg">Loading scheduled appointments...</p>
          ) : reservations.length === 0 ? (
            <div className="reservations-placeholder">
              No reservation entries found for this account.
            </div>
          ) : (
            <div className="reservations-list">
              {reservations.map((item) => (
                <div key={item._id} className="reservation-card">
                  <div className="res-header">
                    <h3>{item.doctor?.username || "General Practitioner"}</h3>
                    <span className={`status-badge ${item.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="res-details">
                    <p><strong>Date:</strong> {item.preferredDate}</p>
                    <p><strong>Time:</strong> {item.preferredTime}</p>
                    <p><strong>Patient Name:</strong> {item.fullName}</p>

                    {item.cost && (
                      <p><strong>Cost Rate:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>${item.cost.toString().replace(/[^0-9.]/g, '')} USD</span></p>
                    )}

                    <p>
                      <strong>Payment Status:</strong>{" "}
                      {item.isPaid ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Paid Online</span>
                      ) : (
                        <span style={{ color: "orange", fontWeight: "bold" }}>Unpaid Balance</span>
                      )}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>

                      {item.status === 'approved' && !item.isPaid && (
                        activePaymentId === item._id ? (
                          <PayPalButtonComponent
                            cost={item.cost}
                            bookingId={item._id}
                            onSuccess={handlePaymentSuccess}
                            onCancel={() => setActivePaymentId(null)}
                          />
                        ) : (
                          <button className="pay-now-btn" onClick={() => setActivePaymentId(item._id)}>
                            Pay with PayPal
                          </button>
                        )
                      )}
                      <div className="review-section">
                        <button
                          className="btn-review"
                          onClick={() => {
                            console.log("Duke klikuar, DoctorID:", item.doctor?._id);
                            setSelectedDoctor(item.doctor?._id);
                            setShowReviewModal(true);
                          }}
                        >
                          Lini një vlerësim (Test)
                        </button>
                      </div>
                      {item.status !== "Cancelled by Patient" && (
                        <button
                          className="delete-res-btn"
                          onClick={() => handleCancelBooking(item._id)}
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ReviewModal
          show={showReviewModal}
          handleClose={() => setShowReviewModal(false)}
          doctorId={selectedDoctor}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default UserProfile;