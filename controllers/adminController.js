import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";

import Patient from "../models/Patient.js";

/* ============================================
   APPOINTMENTS (ADMIN)
============================================ */

// Get all appointments (doctor + patient)
export const getAllAppointments = async (req, res) => {
  console.log(" [ADMIN] Fetching all appointments...");

  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctorId",
        select: "name departmentId",
        populate: {
          path: "departmentId",
          select: "name",
        },
      })
      .populate("patientId", "name guardianName phone");

    console.log(` Total appointments fetched: ${appointments.length}`);

    res.json(appointments);
  } catch (err) {
    console.error(" Error fetching appointments:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Update appointment
export const updateAppointment = async (req, res) => {
  console.log(` [ADMIN] Updating appointment ID: ${req.params.id}`);
  console.log(" Update payload:", req.body);

  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log(" Appointment updated:", updated);
    res.json(updated);
  } catch (err) {
    console.error(" Error updating appointment:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  console.log(` [ADMIN] Deleting appointment ID: ${req.params.id}`);

  try {
    await Appointment.findByIdAndDelete(req.params.id);
    console.log(" Appointment deleted");
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error deleting appointment:", err.message);
    res.status(400).json({ error: err.message });
  }
};

/* ============================================
   DOCTORS (ADMIN)
============================================ */

// Create new doctor
export const createDoctor = async (req, res) => {
  console.log("[ADMIN] Creating doctor...");
  console.log(" Payload:", req.body);

  try {
    const doctor = await Doctor.create({
      name: req.body.name,
      departmentId: req.body.departmentId,
      schedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    });

    console.log(" Doctor created:", doctor);
    res.json(doctor);
  } catch (err) {
    console.error(" Error creating doctor:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  console.log(" [ADMIN] Fetching all doctors...");

  try {
    const doctors = await Doctor.find().populate("departmentId", "name");

    console.log(`Total doctors fetched: ${doctors.length}`);
    res.json(doctors);
  } catch (err) {
    console.error(" Error fetching doctors:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update doctor schedule
export const updateDoctorSchedule = async (req, res) => {
  try {
    console.log(" Received schedule update:", req.body);

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { schedule: req.body },
      { new: true }
    );

    console.log(" Schedule saved to DB:", doctor.schedule);
    res.json(doctor);
  } catch (err) {
    console.error(" Update error:", err);
    res.status(400).json({ error: err.message });
  }
};

/* ============================================
   DEPARTMENTS (ADMIN)
============================================ */

// Create department
export const createDepartment = async (req, res) => {
  console.log(" [ADMIN] Creating department:", req.body.name);

  try {
    const dept = await Department.create({ name: req.body.name });

    console.log(" Department created:", dept);
    res.json(dept);
  } catch (err) {
    console.error("Error creating department:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  console.log(" [ADMIN] Fetching departments...");

  try {
    const departments = await Department.find();

    console.log(` Total departments fetched: ${departments.length}`);
    res.json(departments);
  } catch (err) {
    console.error(" Error fetching departments:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllPatients = async (req, res) => {
  console.log("[ADMIN] Fetching patients...");
  try {
    const patients = await Patient.find();
    console.log(`Total patients fetched: ${patients.length}`);
    res.json(patients);
  } catch (err) {
    console.error(" Error fetching patients:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create new patient
export const createPatient = async (req, res) => {
  console.log(" [ADMIN] Creating patient...");
  console.log(" Payload:", req.body);

  try {
    const patient = await Patient.create({
      name: req.body.name,
      guardianName: req.body.guardianName,
      phone: req.body.phone,
      email: req.body.email,
      age: req.body.age,
      gender: req.body.gender,
    });

    console.log(" Patient created:", patient);
    res.json(patient);
  } catch (err) {
    console.error(" Error creating patient:", err.message);
    res.status(400).json({ error: err.message });
  }
};



export const getDepartmentsWithDoctors = async (req, res) => {
  try {
    const departments = await Department.find();

    const result = await Promise.all(
      departments.map(async (dept) => {
        const doctors = await Doctor.find({
          departmentId: dept._id,
        }).select("name schedule");

        return {
          _id: dept._id,
          name: dept.name,
          doctors,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching departments with doctors:", err);
    res.status(500).json({ error: err.message });
  }
};

