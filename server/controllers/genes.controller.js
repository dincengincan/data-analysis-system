import Gene from "../mongodb/models/gene.js";

export const getGenesByName = async (req, res) => {
  try {
    // Retrieve genes from query parameters (e.g., /genes?gene=AK212155&gene=AnotherGene)
    const targetGenes = req.query.gene;

    // Check if any genes are provided in the request
    if (!targetGenes || targetGenes.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one gene must be specified in the request." });
    }

    // Use the $in operator to find documents where the gene property matches any of the specified values
    const result = await Gene.find({ gene: { $in: targetGenes } });

    if (result?.length === 0) {
      return res.status(404).json({ error: "No genes found" });
    }

    // Check if all requested genes were found in the database
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
