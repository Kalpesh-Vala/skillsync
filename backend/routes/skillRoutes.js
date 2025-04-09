const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  updateProgress,
  deleteSkill
} = require('../controllers/skillController');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Skill routes
router.post('/', createSkill);
router.get('/', getSkills);
router.get('/:id', getSkill);
router.patch('/:id', updateSkill);
router.post('/:id/progress', updateProgress);
router.delete('/:id', deleteSkill);

module.exports = router;