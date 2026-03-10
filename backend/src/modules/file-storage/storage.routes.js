import express from "express";
import multer from "multer";
import * as controller from "./storage.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validator.middleware.js";
import { uploadValidator, queryValidator } from "./storage.validator.js";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./storage.constants.js";
import { ApiError } from "../../utils/apiError.js";

const router = express.Router();

// Multer memory storage configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ApiError(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`, 400), false);
        }
    }
});

router.use(auth);

/**
 * PATH AGNOSTIC ROUTES (Mounted at /api/v1/storage, /api/v1/reports, /api/v1/doctor)
 * The logic below handles semantics based on where it's mounted or just provides all routes.
 */

/* Patient/Common Storage Routes */
router.post("/upload", upload.single("file"), validate(uploadValidator), controller.upload);
router.get("/", validate(queryValidator, "query"), controller.list);
router.get("/:id", controller.getById);
router.delete("/:id", controller.remove);
router.get("/:id/download", controller.downloadFile);

/* Consent Routes (Sementically under /reports) */
router.post("/grant-access/:appointmentId", role("PATIENT"), controller.grantAccess);
router.post("/revoke-access/:appointmentId", role("PATIENT"), controller.revokeAccess);

/* Doctor Access Routes (Semantically under /doctor) */
router.get("/reports/:appointmentId", role("DOCTOR"), controller.doctorListReports);
router.get("/reports/file/:id", role("DOCTOR"), controller.doctorGetReport);

export default router;