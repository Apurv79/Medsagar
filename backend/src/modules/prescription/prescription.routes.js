import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import * as controller from "./prescription.controller.js";

const router = Router();

router.post("/", auth, role("DOCTOR"), controller.createPrescription);

router.patch("/:id", auth, role("DOCTOR"), controller.updatePrescription);

router.patch("/:id/finalize", auth, role("DOCTOR"), controller.finalizePrescription);

router.get("/my", auth, controller.getMyPrescriptions);

router.get("/:id", auth, controller.getPrescription);

export default router;