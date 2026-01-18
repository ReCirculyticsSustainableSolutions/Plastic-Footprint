const router = require('express').Router();
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Save Project
router.post('/', verifyToken, async (req, res) => {
  console.log("📥 Received Save Request");
  console.log("User:", req.user._id);
  console.log("Data Keys:", Object.keys(req.body));
  
  try {
    const { projectData, bomData, salesData, specData, materialClassData, calculatedResults } = req.body;
    
    // Check if updating existing or creating new (logic simplified here, assuming new for now or ID passed)
    // Ideally user selects "Save" or "Save As". For now, let's just create new entry or update if ID exists.
    
    // If we passed a project ID in body, update it.
    if (req.body._id) {
       console.log("🔄 Updating existing project:", req.body._id);
       const updatedProject = await Project.findOneAndUpdate(
           { _id: req.body._id, userId: req.user._id },
           { projectData, bomData, salesData, specData, materialClassData, calculatedResults, updatedAt: Date.now() },
           { new: true }
       );
       console.log("✅ Update successful");
       return res.json(updatedProject);
    }

    console.log("🆕 Creating new project");
    const newProject = new Project({
      userId: req.user._id,
      projectData,
      bomData,
      salesData,
      specData,
      materialClassData,
      calculatedResults
    });

    const savedProject = await newProject.save();
    console.log("✅ Save successful:", savedProject._id);
    res.json(savedProject);
  } catch (err) {
    console.error("❌ Save Failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get User Projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Specific Project
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
        if(!project) return res.status(404).send('Project not found');
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Project
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Project.deleteOne({ _id: req.params.id, userId: req.user._id });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
