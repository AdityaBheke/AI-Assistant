import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  source: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'replied'],
    default: 'new'
  },
  messages: [{
    role: String,
    content: String
  }],
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