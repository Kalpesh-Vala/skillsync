const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  initialRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Initial rating must be an integer between 1 and 5'
    }
  },
  progress: [progressEntrySchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});

// Virtual for current rating (latest progress entry)
skillSchema.virtual('currentRating').get(function() {
  if (this.progress && this.progress.length > 0) {
    return this.progress[this.progress.length - 1].rating;
  }
  return this.initialRating;
});

// Method to format progress data for Recharts
skillSchema.methods.getProgressData = function() {
  return this.progress.map(entry => ({
    date: entry.timestamp.toISOString().split('T')[0],
    level: entry.rating
  }));
};

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;