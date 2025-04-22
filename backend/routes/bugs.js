import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Bug from '../models/Bug.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `bug-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// @route   GET api/bugs
// @desc    Get all bugs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bugs = await Bug.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name');
    
    res.json(bugs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/bugs/:id
// @desc    Get bug by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name');
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/bugs
// @desc    Create a bug
// @access  Private
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const { title, description, steps, priority } = req.body;
    
    // Get next serial number
    const serialNo = await Bug.getNextSerialNo();
    
    const newBug = new Bug({
      serialNo,
      title,
      description,
      steps,
      priority: priority || 2,
      createdBy: req.user.id,
      screenshot: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    
    const bug = await newBug.save();
    
    // Populate user fields
    await bug.populate('createdBy', 'name');
    
    res.status(201).json(bug);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PATCH api/bugs/:id/status
// @desc    Update bug status
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('createdBy', 'name').populate('assignedTo', 'name');
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PATCH api/bugs/:id/assign
// @desc    Assign bug to a user
// @access  Private
router.patch('/:id/assign', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    ).populate('createdBy', 'name').populate('assignedTo', 'name');
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/bugs/:id
// @desc    Delete a bug
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    // Delete associated screenshot if exists
    if (bug.screenshot) {
      const screenshotPath = path.join(__dirname, '..', bug.screenshot);
      if (fs.existsSync(screenshotPath)) {
        fs.unlinkSync(screenshotPath);
      }
    }
    
    await bug.deleteOne();
    
    res.json({ msg: 'Bug removed' });
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;