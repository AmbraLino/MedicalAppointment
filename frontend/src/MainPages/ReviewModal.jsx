import React, { useState, useContext } from "react";
import { UserContext } from "../Auth/UserContext";
import axios from "axios";
import { Rating } from 'react-simple-star-rating'; 
import "./Review.css";

const ReviewModal = ({ show, handleClose, doctorId }) => {
  const { userInfo } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) return alert("Error: Doctor is not specified!");
    
    try {
      await axios.post("http://localhost:5000/api/reviews/add", {
        doctorId,
        patientId: userInfo?._id,
        rating: stars,
        comment
      }, { withCredentials: true });

      alert("Thank you for your review!");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error occurred while submitting the review!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="review-modal">
        <button className="close-btn" onClick={handleClose}>×</button>
        <h3>Rate the Doctor</h3>
        <form onSubmit={handleSubmit}>
          <Rating onClick={(rate) => setStars(rate)} ratingValue={stars} size={30} />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;