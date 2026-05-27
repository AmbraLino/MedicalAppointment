import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewModal from "../MainPages/ReviewModal";
import "./Review.css";

const Reviews = ({ doctorId }) => {
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
    if (!doctorId) return; 

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/doctor/${doctorId}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchReviews();
}, [doctorId]); // This will re-run automatically when doctorId changes

    return (
        <div className="reviews-page">
            <h3>Patient Reviews</h3>
            <div className="reviews-list">
                {reviews.length > 0 ? reviews.map((rev) => (
                    <div key={rev._id} className="review-card">
                        <p><strong>{rev.patientId?.username || "Pacient"}</strong>: {rev.rating} yje</p>
                        <p>"{rev.comment}"</p>
                    </div>
                )) : <p>No reviews yet.</p>}
            </div>

            {!doctorId && <button onClick={() => setShowModal(true)}>Leave a Review</button>}

            <ReviewModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                doctorId={doctorId}
            />
        </div>
    );
};

export default Reviews;