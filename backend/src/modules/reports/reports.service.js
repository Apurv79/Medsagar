import Report from "./reports.model.js";

const STORAGE_LIMIT = 100 * 1024 * 1024;

export const createReport = async (payload) => {
  const used = await Report.aggregate([
    { $match: { patientId: payload.patientId } },
    { $group: { _id: null, total: { $sum: "$size" } } },
  ]);

  const usedStorage = used[0]?.total || 0;

  if (usedStorage + payload.size > STORAGE_LIMIT)
    throw new Error("Storage quota exceeded");

  return Report.create(payload);
};

export const requestAccess = async (reportId, doctorId) => {
  return Report.findByIdAndUpdate(
    reportId,
    { $push: { accessRequests: { doctorId } } },
    { new: true }
  ).lean();
};

export const approveAccess = async (reportId, doctorId) => {
  return Report.updateOne(
    { _id: reportId, "accessRequests.doctorId": doctorId },
    { $set: { "accessRequests.$.approved": true } }
  );
};

export const getPatientReports = (patientId) => {
  return Report.find({ patientId }).sort({ createdAt: -1 }).lean();
};

export const getReport = (id) => {
  return Report.findById(id).lean();
};

export const deleteReport = async (id) => {
  return Report.findByIdAndDelete(id);
};