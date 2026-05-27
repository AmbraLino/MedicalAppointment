const express = require('express');
const router = express.Router();
const Review = require('../Models/reviewModel');

// 1. POST: Shto një vlerësim të ri (Vetëm një herë!)
router.post('/add', async (req, res) => {
  try {
    const { doctorId, patientId, rating, comment } = req.body;
    
    // Validim: Sigurohemi që të gjitha të dhënat janë prezente
    if (!doctorId || !patientId || !rating) {
      return res.status(400).json({ message: "Të dhëna të paplota për vlerësimin!" });
    }

    const newReview = new Review({ doctorId, patientId, rating, comment });
    await newReview.save();
    
    res.status(201).json({ message: "Vlerësimi u ruajt me sukses!", review: newReview });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Gabim gjatë ruajtjes së vlerësimit", error: error.message });
  }
});

// 2. GET: Merr vlerësimet për një doktor specifik
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'username'); 
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë marrjes së vlerësimeve" });
  }
});

// 3. GET: Merr 3 vlerësimet e fundit
router.get('/top', async (req, res) => {
  try {
    const topReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('patientId', 'username'); 
    res.json(topReviews);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë marrjes së vlerësimeve kryesore" });
  }
});

// 4. GET: Merr të gjitha vlerësimet
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('patientId', 'username')
      .populate('doctorId', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Gabim në server" });
  }
});

module.exports = router;