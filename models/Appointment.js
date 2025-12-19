import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Exact appointment date
    date: {
      type: Date,
      required: true,
    },

    // Week identifier (VERY IMPORTANT)
    weekStart: {
      type: Date, // Monday 00:00 of that week
      required: true,
    },

    slot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

/**
 * 🔒 Prevent race condition
 * Same doctor + same week + same date + same slot
 */
appointmentSchema.index(
  { doctorId: 1, weekStart: 1, date: 1, "slot.start": 1 },
  { unique: true }
);

export default mongoose.model("Appointment", appointmentSchema);
