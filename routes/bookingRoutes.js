import express from "express";
import {
  getDepartments,
  getDoctorsByDepartment,
  getDoctorSlots,
  bookAppointment,
} from "../controllers/bookingController.js";

const router = express.Router();

/* ================================
   PATIENT BOOKING FLOW
================================ */

// 1️⃣ List departments
router.get("/departments", getDepartments);

// 2️⃣ List doctors in a department
router.get("/departments/:id/doctors", getDoctorsByDepartment);

// 3️⃣ Get available slots for a doctor on a specific date
//    Expected: /slots?doctorId=123&date=2025-12-14
router.get("/slots", getDoctorSlots);

// 4️⃣ Book an appointment
router.post("/appointments", bookAppointment);

export default router;
