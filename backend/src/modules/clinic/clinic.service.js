import Clinic from "./clinic.model.js";
import Doctor from "../doctor/doctor.model.js";
import { generateId } from "../../utils/idGenerator.js";
import { ApiError } from "../../utils/apiError.js";

const getIdQuery = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if it's _id or staff userId
        const clinic = await Clinic.findOne({ $or: [{ _id: id }, { staffIds: id }] });
        if (clinic) return { _id: clinic._id };
    }
    return { clinicId: id };
};

export const createClinic = async (data) => {
    if (!data.clinicId) {
        data.clinicId = await generateId("CLI");
    }
    return Clinic.create(data);
};

export const getClinicById = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).populate("doctorIds staffIds");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

export const listClinics = async (query = {}) => {
    const { city, isActive = true } = query;
    const filter = { isActive };
    if (city) filter.city = city;
    return Clinic.find(filter).lean();
};

export const verifyClinic = async (id, status) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOneAndUpdate(query, { verificationStatus: status }, { returnDocument: "after" });
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

/* --- FEATURES --- */

export const addDoctorToClinic = async (clinicId, doctorId) => {
    const cQuery = await getIdQuery(clinicId);
    const dQuery = doctorId.match(/^[0-9a-fA-F]{24}$/) ? { _id: doctorId } : { doctorId };

    const doc = await Doctor.findOne(dQuery);
    if (!doc) throw new ApiError("Doctor Profile not found", 404);

    const clinic = await Clinic.findOne(cQuery);
    if (!clinic) throw new ApiError("Clinic not found", 404);

    await Doctor.updateOne({ _id: doc._id }, { $addToSet: { clinicIds: clinic._id } });
    return Clinic.findOneAndUpdate({ _id: clinic._id }, { $addToSet: { doctorIds: doc._id } }, { returnDocument: "after" });
};

export const removeDoctorFromClinic = async (clinicId, doctorId) => {
    const cQuery = await getIdQuery(clinicId);
    const dQuery = doctorId.match(/^[0-9a-fA-F]{24}$/) ? { _id: doctorId } : { doctorId };

    const doc = await Doctor.findOne(dQuery);
    if (!doc) throw new ApiError("Doctor Profile not found", 404);

    const clinic = await Clinic.findOne(cQuery);
    if (!clinic) throw new ApiError("Clinic not found", 404);

    await Doctor.updateOne({ _id: doc._id }, { $pull: { clinicIds: clinic._id } });
    return Clinic.findOneAndUpdate({ _id: clinic._id }, { $pull: { doctorIds: doc._id } }, { returnDocument: "after" });
};

export const updateClinicHours = async (clinicId, hours) => {
    const query = await getIdQuery(clinicId);
    const clinic = await Clinic.findOneAndUpdate(query, { operatingHours: hours }, { returnDocument: "after" });
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

export const addClinicImage = async (clinicId, imageUrl, isPrimary) => {
    const query = await getIdQuery(clinicId);
    const clinicExist = await Clinic.findOne(query);
    if (!clinicExist) throw new ApiError("Clinic not found", 404);

    if (isPrimary) {
        await Clinic.updateOne({ _id: clinicExist._id }, { $set: { "images.$[].isPrimary": false } });
    }
    return Clinic.findOneAndUpdate({ _id: clinicExist._id }, { $push: { images: { url: imageUrl, isPrimary } } }, { returnDocument: "after" });
};

export const removeClinicImage = async (clinicId, imageId) => {
    const query = await getIdQuery(clinicId);
    const clinic = await Clinic.findOneAndUpdate(query, { $pull: { images: { _id: imageId } } }, { returnDocument: "after" });
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

export const manageServices = async (clinicId, services) => {
    const query = await getIdQuery(clinicId);
    const clinic = await Clinic.findOneAndUpdate(query, { services }, { returnDocument: "after" });
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

export const manageStaff = async (clinicId, userId, action = "add") => {
    const query = await getIdQuery(clinicId);
    const update = action === "add" ? { $addToSet: { staffIds: userId } } : { $pull: { staffIds: userId } };
    const clinic = await Clinic.findOneAndUpdate(query, update, { returnDocument: "after" });
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

export const getClinicDoctors = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).select("doctorIds").populate("doctorIds");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic?.doctorIds || [];
};

export const getClinicStaff = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).select("staffIds").populate("staffIds");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic?.staffIds || [];
};

export const getClinicServices = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).select("services");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic?.services || [];
};

export const getClinicOperatingHours = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).select("operatingHours");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic?.operatingHours || [];
};

export const getClinicImages = async (id) => {
    const query = await getIdQuery(id);
    const clinic = await Clinic.findOne(query).select("images");
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic?.images || [];
};