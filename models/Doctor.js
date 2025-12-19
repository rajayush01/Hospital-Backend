import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // "09:00"
  end: { type: String, required: true },   // "09:30"
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  schedule: {
    monday:    { type: [slotSchema], default: [] },
    tuesday:   { type: [slotSchema], default: [] },
    wednesday: { type: [slotSchema], default: [] },
    thursday:  { type: [slotSchema], default: [] },
    friday:    { type: [slotSchema], default: [] },
    saturday:  { type: [slotSchema], default: [] },
    sunday:    { type: [slotSchema], default: [] },
  },
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
