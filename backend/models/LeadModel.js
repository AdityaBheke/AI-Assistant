import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String
  },
  source: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'replied', 'converted'],
    default: 'new'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lead', leadSchema);