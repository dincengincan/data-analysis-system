import Gene from "../mongodb/models/gene.js";

export const getOutliers = async (req, res) => {
  try {
    const targetGene = req.query.gene;

    if (!targetGene) {
      return res.status(400).json({ error: "Gene must be specified." });
    }

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
          expressionValues: {
            $push: {
              type: "$expressionValues.k",
              value: "$expressionValues.v",
            },
          },
        },
      },
    ];

    const result = await Gene.aggregate(pipeline);

    if (result?.length === 0) {
      return res.status(404).json({ error: `Gene not found: ${targetGene}` });
    }

    const { expressionValues } = result?.[0];

    const data = identifyOutliers(
      expressionValues?.map((entry) => entry.value)
    );

    const maxExpressionValue = expressionValues?.reduce(
      (acc, curr) => Math.max(acc, curr.value),
      0
    );

    const formattedData = expressionValues?.map((entry) => ({
      expressionType: entry.type,
      expressionValue: entry.value,
      outlier: data.outliers.includes(entry.value),
      min: data.lowerBound,
      max: data.upperBound,
      top: Math.floor(Math.max(data.upperBound, maxExpressionValue) * 1.2),
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function identifyOutliers(data) {
  // Calculate quartiles and IQR
  const q1 = quantile(data, 0.25);
  const q3 = quantile(data, 0.75);
  const iqr = q3 - q1;

  // Define the lower and upper bounds for potential outliers
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Identify potential outliers
  const outliers = data.filter(
    (value) => value < lowerBound || value > upperBound
  );

  return { outliers, lowerBound, upperBound };
}

function quantile(arr, percentile) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const index = Math.floor(percentile * (sortedArr.length - 1));
  const fraction = percentile * (sortedArr.length - 1) - index;

  return (
    sortedArr[index] + fraction * (sortedArr[index + 1] - sortedArr[index])
  );
}
