import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import * as controller from "./reports.controller.js";
import { uploadReport } from "./report.upload.js";

const router = Router();

router.post(
  "/upload",
  auth,
  uploadReport.single("file"),
  controller.uploadReport
);

router.post("/:id/request-access", auth, role("DOCTOR"), controller.requestAccess);

router.patch("/:id/approve-access", auth, controller.approveAccess);

router.get("/my", auth, controller.getMyReports);

router.get("/:id", auth, controller.getReport);

router.delete("/:id", auth, controller.deleteReport);

export default router;