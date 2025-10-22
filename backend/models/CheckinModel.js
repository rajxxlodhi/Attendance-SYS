import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  image: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  autoFinished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const CheckIn = mongoose.model("CheckIn", checkInSchema);
export default CheckIn;
