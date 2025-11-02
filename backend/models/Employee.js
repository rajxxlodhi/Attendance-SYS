import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: 
  { type: String,
     required: true 

  },
  email: {
     type: String,
      required: true,
       unique: true 
      },
  password: {
     type: String,
      required: true
     },
  role: {
     type: String,
      enum: ["employee", "admin"]
     },
    newCheckin:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"CheckIn",
      
    },
    checkins: [{ type: mongoose.Schema.Types.ObjectId, ref: "CheckIn" }],
    
  createdAt:
   { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);
