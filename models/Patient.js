import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Patient name

  guardianName: { type: String, required: true },

  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // optional validation
  },

  email: { type: String },
  age: Number,
  gender: String,
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
