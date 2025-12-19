import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import moment from "moment";
import { getWeekStart } from "../utils/dateutils.js";


// ==============================
// DEPARTMENTS
// ==============================
export const getDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

// ==============================
// DOCTORS BY DEPARTMENT
// ==============================
export const getDoctorsByDepartment = async (req, res) => {
  const doctors = await Doctor.find({ departmentId: req.params.id });
  res.json(doctors);
};

// ==============================
// HELPER: Find next available day
// ==============================
const findNextAvailableDate = async (doctor) => {
  for (let i = 1; i <= 14; i++) {
    const date = moment().add(i, "days");
    const dayName = date.format("dddd").toLowerCase();

    if (doctor.schedule[dayName]?.length > 0) {
      return date.format("YYYY-MM-DD");
    }
  }
  return null;
};

// ==============================
// GET DOCTOR SLOTS FOR A DATE
// ==============================
// export const getDoctorSlots = async (req, res) => {
//   const { doctorId, date } = req.query;

//   const doctor = await Doctor.findById(doctorId);
//   if (!doctor) return res.status(404).json({ error: "Doctor not found" });

//   const dayName = moment(date).format("dddd").toLowerCase();
//   const schedule = doctor.schedule[dayName] ?? [];

//   if (!schedule || schedule.length === 0) {
//     return res.json({
//       availableSlots: [],
//       nextAvailableDate: await findNextAvailableDate(doctor),
//     });
//   }

//   const booked = await Appointment.find({ doctorId, date });
//   const bookedSlots = booked.map((b) => b.slot.start);

//   // FIXED
//   const availableSlots = schedule.filter(
//     (slot) => !bookedSlots.includes(slot.start)
//   );

//   res.json({ availableSlots });
// };

export const getDoctorSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  const dateObj = new Date(date);
  const weekStart = getWeekStart(dateObj);

  const dayName = moment(dateObj).format("dddd").toLowerCase();
  const schedule = doctor.schedule[dayName] ?? [];

  if (schedule.length === 0) {
    return res.json({
      availableSlots: [],
      nextAvailableDate: await findNextAvailableDate(doctor),
    });
  }

  // 🔑 WEEK-SCOPED BOOKINGS
  const booked = await Appointment.find({
    doctorId,
    weekStart,
    date: dateObj,
  });

  const bookedSlots = booked.map((b) => b.slot.start);

  const availableSlots = schedule.filter(
    (slot) => !bookedSlots.includes(slot.start)
  );

  res.json({ availableSlots });
};


// ==============================
// BOOK APPOINTMENT
// ==============================
// export const bookAppointment = async (req, res) => {
//   try {
//     const { doctorId, patientId, date, slot } = req.body;

//     // Check if slot already booked
//     const exists = await Appointment.findOne({
//       doctorId,
//       date,
//       "slot.start": slot.start
//     });

//     if (exists) {
//       return res.status(400).json({ error: "This slot is already booked" });
//     }

//     // Create appointment
//     const appt = await Appointment.create({
//       doctorId,
//       patientId,
//       date,
//       slot,
//       status: "booked",
//     });

//     res.json({ success: true, appt });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const bookAppointment = async (req, res) => {
//   try {
//     const {
//       doctorId,
//       date,
//       slot,
//       patientName,
//       guardianName,
//       phone,
//     } = req.body;

//     // 1️⃣ Validate required fields
//     if (!doctorId || !date || !slot || !patientName || !phone) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // 2️⃣ Create patient
//     const patient = await Patient.create({
//       name: patientName,
//       guardianName,
//       phone,
//     });

//     // 3️⃣ Prevent double booking
//     const exists = await Appointment.findOne({
//       doctorId,
//       date,
//       "slot.start": slot.start,
//     });

//     if (exists) {
//       return res.status(400).json({ error: "This slot is already booked" });
//     }

//     // 4️⃣ Create appointment
//     const appointment = await Appointment.create({
//       doctorId,
//       patientId: patient._id,
//       date,
//       slot,
//       status: "booked",
//     });

//     res.json({ success: true, appointment });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      slot,
      patientName,
      guardianName,
      phone,
    } = req.body;

    if (!doctorId || !date || !slot || !patientName || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appointmentDate = new Date(date);
    const weekStart = getWeekStart(appointmentDate);

    // Create patient
    const patient = await Patient.create({
      name: patientName,
      guardianName,
      phone,
    });

    //  Race condition prevented by UNIQUE INDEX
    const appointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      date: appointmentDate,
      weekStart,
      slot,
      status: "booked",
    });

    res.json({ success: true, appointment });

  } catch (err) {
    //  Duplicate slot in same week
    if (err.code === 11000) {
      return res.status(409).json({
        error: "This slot is already booked",
      });
    }

    res.status(500).json({ error: err.message });
  }
};




