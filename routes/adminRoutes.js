import express from "express";
import {
  // Appointment management
  getAllAppointments,
  updateAppointment,
  deleteAppointment,

  // Doctor management
  getAllDoctors,
  createDoctor,
  updateDoctorSchedule,

  // Department management
  getAllDepartments,
  createDepartment,
  getDepartmentsWithDoctors,

  // Patient management (NEW)
  getAllPatients,
  createPatient,
} from "../controllers/adminController.js";

const router = express.Router();

/* ================================
   APPOINTMENTS (ADMIN)
================================ */
router.get("/appointments", getAllAppointments);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

/* ================================
   DOCTORS (ADMIN)
================================ */
router.get("/doctors", getAllDoctors);          
router.post("/doctors", createDoctor);          
router.put("/doctors/:id/schedule", updateDoctorSchedule);

/* ================================
   PATIENTS (ADMIN)
================================ */
router.get("/patients", getAllPatients);
router.post("/patients", createPatient);

/* ================================
   DEPARTMENTS (ADMIN)
================================ */
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);

router.get("/departments-with-doctors", getDepartmentsWithDoctors);


export default router;
