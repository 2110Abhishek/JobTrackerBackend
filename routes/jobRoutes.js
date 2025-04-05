const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// Add Job
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Jobs (with optional filter)
router.get("/", async (req, res) => {
  const { status, sort } = req.query;
  let filter = {};
  if (status) filter.status = status;

  try {
    let jobs = await Job.find(filter);
    if (sort === "latest") {
      jobs.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Job Status
router.put("/jobs/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.status(200).json(job);
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });
  

// Delete Job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
