import { Card, CardContent, Typography } from "@mui/material";

type AnalysisCardProps = {
  median: number;
  mean: number;
  variance: number;
  geneName: string;
};

export const AnalysisCard = ({
  geneName,
  median,
  mean,
  variance,
}: AnalysisCardProps) => {
  return (
    <Card sx={{ padding: 2 }}>
      <Typography variant="h5">Analysis for {geneName}</Typography>
      <CardContent sx={{ display: "flex", gap: 16 }}>
        <div>
          <Typography variant="h6" gutterBottom>
            Mean
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {mean.toFixed(2)}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" gutterBottom>
            Median
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {median.toFixed(2)}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" gutterBottom>
            Variance
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {variance.toFixed(2)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
