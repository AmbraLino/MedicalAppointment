// const express = require('express');
// const router = express.Router();
// const bookingModel = require('../Models/bookingModel');

// router.post("/", async (req, res) => {
//   try {
//     const newBooking = new bookingModel({
//       fullName: req.body.fullName,
//       phoneNumber: req.body.phoneNumber,
//       doctorId: req.body.doctorId,
//       preferredDate: req.body.preferredDate,
//       preferredTime: req.body.preferredTime,
//       status: 'pending'
//     });

//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (error) {
//     console.error("GABIMI:", error.message);
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const bookingModel = require('../Models/bookingModel');

// KJO ËSHTË PJESA QË TË MUNGON DHE SHKAKTON 404
router.get("/doctor-schedule/:id", async (req, res) => {
  try {
    const appointments = await bookingModel.find({ doctorId: req.params.id });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kjo është për të bërë rezervimin
router.post("/doctor-schedule/:id", async (req, res) => {
  try {
    const newBooking = new bookingModel({
      ...req.body,
      doctorId: req.params.id,
      status: 'pending'
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;