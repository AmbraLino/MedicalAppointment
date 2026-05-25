const Department = require("./Models/departmentModel");

app.get("/api/departments/:id", async (req, res) => {
  try {
    const dept = await Department.findOne({ id: req.params.id });
    if (!dept) return res.status(404).json({ message: "Departamenti nuk u gjet" });
    res.json(dept);
  } catch (err) {
    res.status(500).json(err);
  }
});