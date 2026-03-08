import * as service from "./appointment.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { pagination } from "../../utils/pagination.js";

export const bookAppointment = asyncHandler(async (req, res) => {
  const data = await service.bookAppointment({
    ...req.body,
    patientId: req.user.userId || req.user._id, // match older req.user
  });
  return ApiResponse.success(res, "Appointment booked successfully", data);
});

export const getAppointment = asyncHandler(async (req, res) => {
  const data = await service.getAppointmentById(req.params.id);
  return ApiResponse.success(res, "Appointment fetched successfully", data);
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const p = pagination(req.query.page, req.query.limit);
  const data = await service.getPatientAppointments(req.user.userId || req.user._id, p);
  return ApiResponse.success(res, "User appointments fetched", data);
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const p = pagination(req.query.page, req.query.limit);
  const data = await service.getDoctorAppointments(req.user.userId || req.user._id, p);
  return ApiResponse.success(res, "Doctor appointments fetched", data);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const data = await service.cancelAppointment(req.params.id, req.body.reason);
  return ApiResponse.success(res, "Appointment cancelled", data);
});

export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const data = await service.rescheduleAppointment(
    req.params.id,
    req.body.slotStart
  );
  return ApiResponse.success(res, "Appointment rescheduled", data);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await service.updateStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, "Status updated", data);
});

export const upcomingAppointments = asyncHandler(async (req, res) => {
  const data = await service.getUpcomingAppointments(req.user.userId || req.user._id);
  return ApiResponse.success(res, "Upcoming fetched", data);
});

export const historyAppointments = asyncHandler(async (req, res) => {
  const data = await service.getHistoryAppointments(req.user.userId || req.user._id);
  return ApiResponse.success(res, "History fetched", data);
});