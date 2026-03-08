import Appointment from "./appointment.model.js";
import dayjs from "dayjs";
import { calculateSlotEnd, isCancellationAllowed, generateSlots } from "./appointment.utils.js";
import { APPOINTMENT_STATUS, STATUS_TRANSITIONS } from "./appointment.constants.js";

export const bookAppointment = async (payload) => {
  const slotEnd = calculateSlotEnd(payload.slotStart);

  const conflict = await Appointment.findOne({
    doctorId: payload.doctorId,
    slotStart: payload.slotStart,
    status: APPOINTMENT_STATUS.CONFIRMED,
  }).lean();

  if (conflict) throw new Error("Slot already booked");

  return Appointment.create({
    ...payload,
    slotEnd,
  });
};

export const getAppointmentById = (id) => {
  return Appointment.findById(id).lean();
};

export const getPatientAppointments = async (patientId, pagination) => {
  return Appointment.find({ patientId })
    .sort({ appointmentDate: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();
};

export const getDoctorAppointments = async (doctorId, pagination) => {
  return Appointment.find({ doctorId })
    .sort({ appointmentDate: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();
};

export const cancelAppointment = async (id, reason) => {
  const appointment = await Appointment.findById(id).lean();

  if (!appointment) throw new Error("Appointment not found");

  if (!isCancellationAllowed(appointment.slotStart))
    throw new Error("Cancellation window closed");

  return Appointment.findByIdAndUpdate(
    id,
    {
      status: APPOINTMENT_STATUS.CANCELLED,
      cancelReason: reason,
    },
    { new: true }
  ).lean();
};

export const rescheduleAppointment = async (id, slotStart) => {
  const appointment = await Appointment.findById(id).lean();

  if (!appointment) throw new Error("Appointment not found");

  const slotEnd = calculateSlotEnd(slotStart);

  return Appointment.findByIdAndUpdate(
    id,
    {
      slotStart,
      slotEnd,
      status: APPOINTMENT_STATUS.RESCHEDULED,
    },
    { new: true }
  ).lean();
};

export const updateStatus = async (id, newStatus) => {
  const appointment = await Appointment.findById(id).lean();

  const allowed = STATUS_TRANSITIONS[appointment.status] || [];

  if (!allowed.includes(newStatus)) {
    throw new Error("Invalid status transition");
  }

  return Appointment.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  ).lean();
};

export const getUpcomingAppointments = (patientId) => {
  return Appointment.find({
    patientId,
    appointmentDate: { $gte: new Date() },
  }).lean();
};

export const getHistoryAppointments = (patientId) => {
  return Appointment.find({
    patientId,
    appointmentDate: { $lt: new Date() },
  }).lean();
};

export const getAvailableSlots = async (doctorId, start, end, date) => {
  const slots = generateSlots(start, end);

  const booked = await Appointment.find({
    doctorId,
    appointmentDate: date,
    status: APPOINTMENT_STATUS.CONFIRMED,
  })
    .select("slotStart")
    .lean();

  const bookedTimes = new Set(booked.map((b) => new Date(b.slotStart).getTime()));

  return slots.filter((slot) => !bookedTimes.has(new Date(slot.slotStart).getTime()));
};