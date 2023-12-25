import express from "express";

import {
  getAllGeneNames,
  getGeneDetailByName,
} from "../controllers/genes.controller.js";
import { getAnalysis } from "../controllers/analysis.controller.js";
import { getOutliers } from "../controllers/outliers.controller.js";

const router = express.Router();

router.route("/").get(getAllGeneNames);
router.route("/gene").get(getGeneDetailByName);
router.route("/analysis").get(getAnalysis);
router.route("/outliers").get(getOutliers);

export default router;
