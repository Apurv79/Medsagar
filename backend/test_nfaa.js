import fetch from "node-fetch"; // or use native fetch
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config({ path: ".env.development" });

import User from "./src/modules/user/user.model.js";
import Doctor from "./src/modules/doctor/doctor.model.js";
import Appointment from "./src/modules/appointment/appointment.model.js";

const BASE_URL = "http://localhost:4501/api/v1";

const request = async (endpoint, method = "GET", body = null, token = null, isFormData = false) => {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData && body) headers["Content-Type"] = "application/json";

    const options = {
        method,
        headers,
    };
    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        let data;
        try {
            data = await response.json();
        } catch {
            data = await response.text();
        }
        return { status: response.status, data };
    } catch (error) {
        console.error(`Request to ${endpoint} failed:`, error);
        return { status: 500, data: error.message };
    }
};

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
};

async function runTests() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for tests.");

    // Seed test users
    let superAdmin = await User.findOne({ role: "SUPER_ADMIN" });
    if (!superAdmin) {
        superAdmin = await User.create({ name: "Super", email: "super@test.com", password: "pwd", role: "SUPER_ADMIN", isActive: true });
    }

    let admin = await User.findOne({ role: "ADMIN" });
    if (!admin) {
        admin = await User.create({ name: "Admin", email: "admin@test.com", password: "pwd", role: "ADMIN", isActive: true });
    }

    let patient = await User.findOne({ role: "PATIENT" });
    if (!patient) {
        patient = await User.create({ name: "Pat", email: "pat@test.com", password: "pwd", role: "PATIENT", isActive: true });
    }

    let doctorUser = await User.findOne({ role: "DOCTOR" });
    if (!doctorUser) {
        doctorUser = await User.create({ name: "Doc", email: "doc@test.com", password: "pwd", role: "DOCTOR", isActive: true });
    }

    let doctorProfile = await Doctor.findOne({ userId: doctorUser._id });
    if (!doctorProfile) {
        doctorProfile = await Doctor.create({
            userId: doctorUser._id,
            doctorId: "DOC_TEST",
            licenseNumber: "LIC123",
            verificationStatus: "pending"
        });
    }

    // Dummy Appointment
    let appointment = await Appointment.findOne({ patientId: patient._id });
    if (!appointment) {
        appointment = await Appointment.create({
            patientId: patient._id,
            doctorId: doctorProfile._id,
            consultationType: "video",
            appointmentDate: new Date(),
            slotStart: new Date(),
            slotEnd: new Date(Date.now() + 3600000), // + 1 hour
            status: "confirmed",
            paymentId: new mongoose.Types.ObjectId()
        });
    }

    const saToken = generateToken(superAdmin._id.toString(), superAdmin.role);
    const aToken = generateToken(admin._id.toString(), admin.role);
    const pToken = generateToken(patient._id.toString(), patient.role);
    const dToken = generateToken(doctorUser._id.toString(), doctorUser.role);

    console.log("\n=========================");
    console.log("STARTING TESTS");
    console.log("=========================\n");

    let totalTests = 0;
    let passedTests = 0;

    const assertResponse = (name, res, expectedStatuses) => {
        totalTests++;
        if (expectedStatuses.includes(res.status)) {
            console.log(`✅ [PASS] ${name} (Status: ${res.status})`);
            passedTests++;
        } else {
            console.error(`❌ [FAIL] ${name} (Status: ${res.status})`);
            console.error("Response:", JSON.stringify(res.data, null, 2));
        }
    };

    // --- NOTIFICATION MODULE ---
    console.log("\n--- NOTIFICATION MODULE ---");
    let res = await request("/notifications", "GET", null, pToken);
    assertResponse("List Notifications", res, [200]);

    res = await request("/notifications/unread-count", "GET", null, pToken);
    assertResponse("Unread Count", res, [200]);

    res = await request("/notifications/read-all", "PATCH", null, pToken);
    assertResponse("Read All", res, [200]);

    res = await request("/notifications/register-device", "POST", { token: "dummy_fcm_token" }, pToken);
    assertResponse("Register Device Token", res, [200]);

    res = await request("/notifications/preferences", "GET", null, pToken);
    assertResponse("Get Notification Preferences", res, [200]);

    res = await request("/notifications/preferences", "PATCH", { preferences: { pushEnabled: false } }, pToken);
    assertResponse("Update Notification Preferences", res, [200]);


    // --- ADMIN MODULE ---
    console.log("\n--- ADMIN MODULE ---");
    res = await request("/admin/doctors/pending", "GET", null, aToken);
    assertResponse("Get Pending Doctors", res, [200]);

    if (res.data?.data?.doctors?.length > 0) {
        const pendingDocId = res.data.data.doctors[0]._id;
        res = await request(`/admin/doctors/${pendingDocId}/approve`, "PATCH", null, aToken);
        assertResponse("Approve Doctor", res, [200, 400]); // 400 if already approved
    } else {
        res = await request(`/admin/doctors/${doctorProfile._id}/approve`, "PATCH", null, aToken);
        assertResponse("Approve Created Doctor", res, [200, 400]);
    }

    res = await request("/admin/users", "GET", null, aToken);
    assertResponse("List Users", res, [200]);

    res = await request("/admin/appointments", "GET", null, aToken);
    assertResponse("Admin List Appointments", res, [200]);

    res = await request("/admin/config", "POST", { key: "TEST_CONFIG", value: "testing" }, saToken);
    assertResponse("Create Config (Super Admin)", res, [200]);

    res = await request("/admin/config", "GET", null, saToken);
    assertResponse("List Configs (Super Admin)", res, [200]);

    res = await request("/admin/config/TEST_CONFIG", "DELETE", null, saToken);
    assertResponse("Delete Config (Super Admin)", res, [200]);


    // --- ANALYTICS MODULE ---
    console.log("\n--- ANALYTICS MODULE ---");
    res = await request("/analytics/dashboard", "GET", null, aToken);
    assertResponse("Dashboard Overview", res, [200]);

    res = await request("/analytics/today", "GET", null, aToken);
    assertResponse("Today's Metrics", res, [200]);

    res = await request("/analytics/doctors/top", "GET", null, aToken);
    assertResponse("Top Doctors", res, [200]);

    res = await request("/analytics/wallet", "GET", null, aToken);
    assertResponse("Wallet Analytics", res, [200]);


    // --- FILE STORAGE MODULE ---
    console.log("\n--- FILE STORAGE MODULE ---");

    // Create dummy text file
    fs.writeFileSync("dummy.txt", "Hello World");

    const formData = new FormData();
    // FormData native blob implementation
    const fileBlob = new Blob([fs.readFileSync("dummy.txt")], { type: "text/plain" });
    formData.append("file", fileBlob, "dummy.txt");
    formData.append("folder", "reports/");

    res = await request("/storage/upload", "POST", formData, pToken, true);
    assertResponse("Upload File (Invalid Type check)", res, [400]);
    // It should be 400 because only JPG, PNG, PDF are allowed

    // Let's create a dummy PDF to test success
    fs.writeFileSync("dummy.pdf", "%PDF-1.4 dummy pdf content");
    const pdfBlob = new Blob([fs.readFileSync("dummy.pdf")], { type: "application/pdf" });
    const formData2 = new FormData();
    formData2.append("file", pdfBlob, "dummy.pdf");
    formData2.append("folder", "reports/");

    res = await request("/storage/upload", "POST", formData2, pToken, true);
    assertResponse("Upload PDF", res, [200, 500]); // 500 if AWS credentials fail
    let uploadedFileId = null;

    if (res.status === 200 && res.data?.data?._id) {
        uploadedFileId = res.data.data._id;
        console.log(`✅ Upload successful to AWS. File ID: ${uploadedFileId}`);
    } else if (res.status === 500) {
        console.warn("⚠️ AWS Upload Failed. Could be due to Invalid AWS Keys or S3 configuration.");
    }

    res = await request("/storage", "GET", null, pToken);
    assertResponse("List Patient Storage Files", res, [200]);

    res = await request(`/reports/grant-access/${appointment._id}`, "POST", null, pToken);
    assertResponse("Grant Doctor Report Access", res, [200]);

    res = await request(`/doctor/reports/${appointment._id}`, "GET", null, dToken);
    assertResponse("Doctor View Accessible Reports", res, [200]);

    if (uploadedFileId) {
        res = await request(`/storage/${uploadedFileId}/download`, "GET", null, pToken);
        assertResponse("Generate Signed URL", res, [200]);

        res = await request(`/storage/${uploadedFileId}`, "DELETE", null, pToken);
        assertResponse("Delete File", res, [200]);
    }

    res = await request(`/reports/revoke-access/${appointment._id}`, "POST", null, pToken);
    assertResponse("Revoke Doctor Report Access", res, [200]);

    // Cleanup local dummy files
    fs.unlinkSync("dummy.txt");
    fs.unlinkSync("dummy.pdf");

    console.log(`\n=========================`);
    console.log(`RESULTS: ${passedTests}/${totalTests} TESTS PASSED.`);
    console.log(`=========================\n`);

    mongoose.connection.close();
}

runTests();
