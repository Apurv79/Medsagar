import Appointment from "./appointment.model.js";

export const createAppointment = (payload) => {
  return Appointment.create(payload);
};

export const findAppointmentById = (id) => {
  return Appointment.findById(id).lean();
};

export const findAppointments = (query, options = {}) => {
  return Appointment.find(query, null, options).lean();
};

export const findDoctorAppointmentsByDate = (doctorId, date) => {
  return Appointment.find({
    doctorId,
    appointmentDate: date,
    status: { $ne: "CANCELLED" },
  }).lean();
};

export const updateAppointment = (id, payload) => {
  return Appointment.findByIdAndUpdate(id, payload, { new: true }).lean();
};

export const deleteAppointment = (id) => {
  return Appointment.findByIdAndDelete(id).lean();
};