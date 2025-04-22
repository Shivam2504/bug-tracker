import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  serialNo: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  steps: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 2
  },
  screenshot: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Static method to get next serial number
bugSchema.statics.getNextSerialNo = async function() {
  const lastBug = await this.findOne().sort('-serialNo');
  return lastBug ? lastBug.serialNo + 1 : 1;
};

const Bug = mongoose.model('Bug', bugSchema);

export default Bug;