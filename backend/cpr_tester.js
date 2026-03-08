import mongoose from "mongoose";
import env from "./src/configs/env.config.js";
import { generateTokenPair } from "./src/utils/jwt.js";
import User from "./src/modules/user/user.model.js";
import Doctor from "./src/modules/doctor/doctor.model.js";

async function generateTestTokens() {
    await mongoose.connect(env.MONGO_URI);

    const doctorUser = await User.findOne({ role: "DOCTOR" });
    let docT = null;
    let docProfileId = null;
    if (doctorUser) {
        docT = generateTokenPair({ userId: doctorUser._id, role: doctorUser.role }).accessToken;
        const doctorProfile = await Doctor.findOne({ userId: doctorUser._id });
        if (doctorProfile) docProfileId = doctorProfile._id;
    }

    const patientUser = await User.findOne({ role: "PATIENT" });
    let patT = null;
    if (patientUser) {
        patT = generateTokenPair({ userId: patientUser._id, role: patientUser.role }).accessToken;
    }

    await mongoose.disconnect();
    return { docT, patT, docProfileId, docUserId: doctorUser?._id, patUserId: patientUser?._id };
}

async function request(method, path, body, token, isFormData = false) {
    const baseUrl = "http://localhost:4501/api/v1";
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method,
            headers,
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
        });

        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = { text: await res.text() };
        }

        return { status: res.status, data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

function logResult(route, res, expectedStatus = [200, 201]) {
    if (!res) {
        console.log(`❌ [---] ${route} - No response object`);
        return;
    }
    const isSuccess = expectedStatus.includes(res.status);
    if (isSuccess) {
        console.log(`✅ [${res.status}] ${route}`);
    } else {
        console.log(`❌ [${res.status}] ${route} - Error: ${JSON.stringify(res.data || res.error)}`);
    }
}

async function runTests() {
    console.log("Generating Tokens...");
    const tokens = await generateTestTokens();
    const docT = tokens.docT;
    const patT = tokens.patT;
    const docProfileId = tokens.docProfileId;

    console.log("=== STARTING CPR TESTS (Chat, Prescription, Reports) ===\n");

    // 1. Setup entities needed
    // Book an appointment and consultation to chat/prescribe
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const randHour = Math.floor(Math.random() * 8) + 8; // 8 AM to 15 PM
    const randMin = Math.floor(Math.random() * 60);

    const bookRes = await request("POST", "/appointments/book", {
        doctorId: docProfileId,
        appointmentDate: tomorrow.toISOString().split("T")[0],
        slotStart: new Date(tomorrow.setHours(randHour, randMin, 0, 0)).toISOString(),
        consultationType: "VIDEO",
        paymentId: new mongoose.Types.ObjectId().toString()
    }, patT);

    if (!bookRes.data?.data?._id) {
        console.log("Could not book an appointment. Test halted.");
        console.log("Status:", bookRes.status);
        console.log("Data:", bookRes.data);
        console.log("Error:", bookRes.error);
        return;
    }

    const appointmentId = bookRes.data.data._id;
    const startRes = await request("POST", "/consultations/start", { appointmentId }, docT);
    const consultationId = startRes.data?.data?.consultationId;


    // --- CHAT MODULE ---
    console.log("\n--- Chat Module ---");
    const chatHistRes = await request("GET", `/chat/history/${consultationId}`, null, patT);
    logResult("GET /chat/history/:consultationId", chatHistRes);


    // --- PRESCRIPTION MODULE ---
    console.log("\n--- Prescription Module ---");
    // End consultation first so a prescription can be made
    await request("POST", "/consultations/end", {
        consultationId,
        summary: "Patient shows signs of recovery"
    }, docT);

    const pCreateRes = await request("POST", "/prescriptions", {
        consultationId,
        patientId: tokens.patUserId,
        medications: [{ name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", duration: "3 days" }],
        notes: "Take after meals"
    }, docT);
    logResult("POST /prescriptions", pCreateRes);
    const prescriptionId = pCreateRes.data?.data?._id;

    if (prescriptionId) {
        const pUpdateRes = await request("PATCH", `/prescriptions/${prescriptionId}`, {
            notes: "Take strictly after meals"
        }, docT);
        logResult("PATCH /prescriptions/:id", pUpdateRes);

        const pFinalizeRes = await request("PATCH", `/prescriptions/${prescriptionId}/finalize`, {}, docT);
        logResult("PATCH /prescriptions/:id/finalize", pFinalizeRes);

        const pGetRes = await request("GET", `/prescriptions/${prescriptionId}`, null, patT);
        logResult("GET /prescriptions/:id", pGetRes);
    }

    const pMyRes = await request("GET", "/prescriptions/my", null, patT);
    logResult("GET /prescriptions/my", pMyRes);


    // --- REPORTS MODULE ---
    console.log("\n--- Reports Module ---");
    // Form data upload
    const formData = new FormData();
    formData.append("title", "Blood Test");
    formData.append("description", "Annual blood test results");
    // Append a mock file string, multer can sometimes handle Blob. Needs to end in .pdf for validation
    formData.append("file", new Blob(["mock file content"], { type: "application/pdf" }), "report.pdf");

    const rUploadRes = await request("POST", "/reports/upload", formData, patT, true);
    logResult("POST /reports/upload", rUploadRes);
    const reportId = rUploadRes.data?.data?._id;

    if (reportId) {
        const rMyRes = await request("GET", "/reports/my", null, patT);
        logResult("GET /reports/my", rMyRes);

        const rGetRes = await request("GET", `/reports/${reportId}`, null, patT);
        logResult("GET /reports/:id", rGetRes);

        const rRequestAccess = await request("POST", `/reports/${reportId}/request-access`, {}, docT);
        logResult("POST /reports/:id/request-access", rRequestAccess);

        const rApproveAccess = await request("PATCH", `/reports/${reportId}/approve-access`, { doctorId: tokens.docUserId }, patT);
        logResult("PATCH /reports/:id/approve-access", rApproveAccess);

        const rDeleteRes = await request("DELETE", `/reports/${reportId}`, null, patT);
        logResult("DELETE /reports/:id", rDeleteRes);
    }

    console.log("\n=== TESTS COMPLETE ===\n");
}

runTests();
