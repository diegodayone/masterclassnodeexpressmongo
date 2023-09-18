//schema del DB per gli URL
import mongoose from 'mongoose';
// const { Schema } = mongoose;

const urlSchema = new mongoose.Schema({
  initialURL: {
    type: String,
    required: true
  },
  shorterURL: {
    type:String,
    required: true,
    unique: true
  },
  clicks: {
      type: Number,
      default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("url", urlSchema)