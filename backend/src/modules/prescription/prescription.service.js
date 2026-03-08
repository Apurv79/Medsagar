import Prescription from "./prescription.model.js";
import Consultation from "../consultation/consultation.model.js";
import { generatePrescriptionPDF } from "./prescription.utils.js";

export const createPrescription = async (payload, doctorId) => {
  const consultation = await Consultation.findById(payload.consultationId).lean();

  if (!consultation) throw new Error("Consultation not found");
  if (consultation.doctorId.toString() !== doctorId)
    throw new Error("Doctor not authorized for this consultation");
  if (consultation.status !== "COMPLETED")
    throw new Error("Consultation must be completed");

  const exists = await Prescription.findOne({
    consultationId: payload.consultationId,
  });

  if (exists) throw new Error("Prescription already exists");

  return Prescription.create({
    ...payload,
    doctorId,
    patientId: consultation.patientId,
  });
};

export const updateDraftPrescription = async (id, payload, doctorId) => {
  const prescription = await Prescription.findById(id);

  if (!prescription) throw new Error("Prescription not found");
  if (prescription.doctorId.toString() !== doctorId)
    throw new Error("Unauthorized");

  if (prescription.status !== "DRAFT")
    throw new Error("Cannot edit finalized prescription");

  Object.assign(prescription, payload);
  await prescription.save();

  return prescription;
};

export const finalizePrescription = async (id, doctorId) => {
  const prescription = await Prescription.findById(id);

  if (!prescription) throw new Error("Prescription not found");
  if (prescription.doctorId.toString() !== doctorId)
    throw new Error("Unauthorized");

  const pdfPath = await generatePrescriptionPDF(prescription);

  prescription.pdfUrl = pdfPath;
  prescription.status = "FINALIZED";

  await prescription.save();

  return prescription;
};

export const getPrescription = (id) => {
  return Prescription.findById(id).lean();
};

export const getPatientPrescriptions = (patientId, page, limit) => {
  return Prescription.find({ patientId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};