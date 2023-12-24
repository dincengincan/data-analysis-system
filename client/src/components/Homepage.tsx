import { useQuery } from "@tanstack/react-query";

import { GenesTable } from "./GenesTable";

import { Layout } from "./Layout";
import { useState } from "react";
import { AnalysisCard } from "./AnalysisCard";
import { AnalysisChart } from "./AnalysisChart";
import {
  Autocomplete,
  Box,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

const Homepage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["genes"],
    queryFn: async () => {
      const data = await fetch(
        "http://localhost:8080/api/genes?gene=AK212155&gene=Sp2&gene=Phyh"
      );
      return await data.json();
    },
  });

  const [selectedGene, setSelectedGene] = useState<string>("");

  const { data: analysisData, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ["analysis", selectedGene],
    enabled: !!selectedGene,
    queryFn: async () => {
      const data = await fetch(
        `http://localhost:8080/api/genes/analysis?gene=${selectedGene}`
      );
      return await data.json();
    },
  });

  const { data: outliersData, isLoading: isOutliersLoading } = useQuery({
    queryKey: ["outliers", selectedGene],
    enabled: !!selectedGene,
    queryFn: async () => {
      const data = await fetch(
        `http://localhost:8080/api/genes/outliers?gene=${selectedGene}`
      );
      return await data.json();
    },
  });

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
  ];

  return (
    <Layout>
      <Typography paddingBottom={8} fontSize="xxx-large">
        Genes
      </Typography>

      <Autocomplete
        multiple
        options={top100Films}
        renderInput={(params) => <TextField {...params} label="Gene ID" />}
      />

      <Box paddingTop={8} display="flex" flexDirection="column" gap={3}>
        {data?.error ? (
          <p>{data.error}</p>
        ) : (
          <GenesTable
            onAnalyzeClick={(gene) => setSelectedGene(gene)}
            isLoading={isLoading}
            genesData={data}
          />
        )}

        {isAnalysisLoading ? (
          <Skeleton height="340px" width="100%" />
        ) : (
          analysisData && (
            <AnalysisCard
              geneName={selectedGene}
              mean={analysisData.mean}
              median={analysisData.median}
              variance={analysisData.variance}
            />
          )
        )}

        {isOutliersLoading ? (
          <Skeleton height="340px" width="100%" />
        ) : (
          outliersData && (
            <AnalysisChart
              geneName={selectedGene}
              analysisData={outliersData}
            />
          )
        )}
      </Box>
    </Layout>
  );
};

export default Homepage;
