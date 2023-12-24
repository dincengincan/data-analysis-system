import Gene from "../mongodb/models/gene.js";

export const getAnalysis = async (req, res) => {
  try {
    // Retrieve genes from query parameters (e.g., /genes?gene=AK212155&gene=AnotherGene)
    const targetGene = req.query.gene;

    // Check if the gene is provided in the request
    if (!targetGene) {
      return res.status(400).json({ error: "Gene must be specified." });
    }

    // Use the $match stage to filter documents by the specified gene
    const pipeline = [
      {
        $match: { gene: targetGene },
      },
      {
        $project: {
          expressionValues: {
            $objectToArray: {
              $mergeObjects: [
                {
                  exper_rep1: "$exper_rep1",
                  exper_rep2: "$exper_rep2",
                  exper_rep3: "$exper_rep3",
                  control_rep1: "$control_rep1",
                  control_rep2: "$control_rep2",
                  control_rep3: "$control_rep3",
                },
              ],
            },
          },
        },
      },
      {
        $unwind: "$expressionValues",
      },
      {
        $group: {
          _id: null,
          expressionValues: { $push: "$expressionValues.v" },
        },
      },
    ];

    const result = await Gene.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(404).json({ error: `Gene not found: ${targetGene}` });
    }

    const expressionValues = result[0].expressionValues;

    const mean = computeMean(expressionValues);
    const median = computeMedian(expressionValues);
    const variance = computeVariance(expressionValues);

    return res.status(200).json({ mean, median, variance });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function computeMean(values) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function computeMedian(values) {
  const sortedValues = values.slice().sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  } else {
    return sortedValues[middleIndex];
  }
}

function computeVariance(values) {
  const mean = computeMean(values);
  const squaredDifferences = values.map((val) => Math.pow(val - mean, 2));
  const sumSquaredDifferences = squaredDifferences.reduce(
    (acc, val) => acc + val,
    0
  );
  return sumSquaredDifferences / values.length;
}
