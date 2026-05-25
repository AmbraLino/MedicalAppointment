const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // psh: "pediatric"
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String },
  icon: { type: String },
  treatments: [
    {
      name: { type: String, required: true },
      desc: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Department", departmentSchema);