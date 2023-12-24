import express from "express";

import {
  getAllGenes,
  getGenesByName,
} from "../controllers/genes.controller.js";
import { getAnalysis } from "../controllers/analysis.controller.js";
import { getOutliers } from "../controllers/outliers.controller.js";

const router = express.Router();

router.route("/").get(getAllGenes);
router.route("/gene").get(getGenesByName);
router.route("/analysis").get(getAnalysis);
router.route("/outliers").get(getOutliers);

export default router;
