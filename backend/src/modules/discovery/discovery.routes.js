import express from "express";
import * as controller from "./discovery.controller.js";

const router = express.Router();

/**
 * Discovery Routes (Public)
 * Used by patients to find care
 */

router.get("/search", controller.search);
router.get("/top-rated", controller.getTopRated);
router.get("/trending", controller.getTrending);
router.get("/nearby", controller.getNearby);
router.get("/clinic/:clinicId", controller.getByClinic);

export default router;