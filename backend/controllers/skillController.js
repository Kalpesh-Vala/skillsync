const Skill = require('../models/Skill');
const { APIError } = require('../middleware/error');

// Create new skill
const createSkill = async (req, res, next) => {
  try {
    const { name, category, initialRating } = req.body;

    const skill = new Skill({
      name,
      category,
      initialRating,
      userId: req.user._id,
      progress: [{
        rating: initialRating,
        timestamp: new Date()
      }]
    });

    await skill.save();

    // Add skill to user's skills array
    req.user.skills.push(skill._id);
    await req.user.save();

    res.status(201).json({
      status: 'success',
      data: { skill }
    });
  } catch (error) {
    next(error);
  }
};

// Get all skills for user with pagination and filtering
const getSkills = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { userId: req.user._id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.name) filter.name = new RegExp(req.query.name, 'i');

    // Execute query with pagination
    const skills = await Skill.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Skill.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        skills,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single skill by ID
const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new APIError(404, 'Skill not found');
    }

    res.json({
      status: 'success',
      data: {
        skill,
        progressData: skill.getProgressData()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update skill
const updateSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    const skill = await Skill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new APIError(404, 'Skill not found');
    }

    // Update basic info
    if (name) skill.name = name;
    if (category) skill.category = category;

    await skill.save();

    res.json({
      status: 'success',
      data: { skill }
    });
  } catch (error) {
    next(error);
  }
};

// Update skill progress
const updateProgress = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const skill = await Skill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new APIError(404, 'Skill not found');
    }

    // Add new progress entry
    skill.progress.push({
      rating,
      timestamp: new Date()
    });

    await skill.save();

    res.json({
      status: 'success',
      data: {
        skill,
        progressData: skill.getProgressData()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete skill
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new APIError(404, 'Skill not found');
    }

    // Remove skill from user's skills array
    req.user.skills = req.user.skills.filter(
      skillId => skillId.toString() !== req.params.id
    );
    await req.user.save();

    res.json({
      status: 'success',
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  updateProgress,
  deleteSkill
};