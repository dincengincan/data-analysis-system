import Gene from "../mongodb/models/gene.js";

export const getGeneDetailByName = async (req, res) => {
  try {
    const targetGenes = req.query.name;

    if (!targetGenes || targetGenes.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one gene must be specified in the request." });
    }

    const result = await Gene.find({ gene: { $in: targetGenes } });

    if (result?.length === 0) {
      return res.status(404).json({ error: "No genes found" });
    }

    const foundGenes = result.map((doc) => doc.gene);
    const missingGenes = Array.isArray(targetGenes)
      ? targetGenes?.filter((gene) => !foundGenes.includes(gene))
      : undefined;

    if (missingGenes?.length > 0) {
      const response = {
        foundGenes: result,
        missingGenes: missingGenes,
        error: `Genes not found: ${missingGenes.join(", ")}`,
      };
      return res.status(404).json(response);
    }

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllGeneNames = async (req, res) => {
  try {
    const searchTerm = req.query.search;

    if (!searchTerm || searchTerm.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one gene must be specified in the request." });
    }

    const result = await Gene.find({
      gene: { $regex: new RegExp(`^${searchTerm}`, "i") },
    });

    if (result?.length === 0) {
      return res.status(404).json([]);
    }

    const allGenes = result.map((doc) => doc.gene);

    res.json(allGenes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
