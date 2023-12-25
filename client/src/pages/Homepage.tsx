import { useQuery } from "@tanstack/react-query";
import { GenesTable } from "../components/GenesTable";
import { Layout } from "../components/Layout";
import { useState } from "react";
import { AnalysisCard } from "../components/AnalysisCard";
import { AnalysisChart } from "../components/AnalysisChart";
import { Box, Typography } from "@mui/material";
import { SearchField } from "../components/SearchField";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { baseApiUrl } from "../api";

const Homepage = () => {
  const [geneToAnalyze, setGeneToAnalyze] = useState("");
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);

  const {
    data: genesTableData,
    isLoading: isGenesTableLoading,
    refetch,
  } = useQuery({
    queryKey: ["geneDetails"],
    enabled: false,
    queryFn: async () => {
      const apiUrl = new URL(`${baseApiUrl}/gene`);
      selectedGenes.forEach((gene) => apiUrl.searchParams.append("name", gene));

      const data = await fetch(apiUrl);
      return await data.json();
    },
  });

  const { data: analysisData, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ["analysis", geneToAnalyze],
    enabled: !!geneToAnalyze,
    queryFn: async () => {
      const data = await fetch(`${baseApiUrl}/analysis?gene=${geneToAnalyze}`);
      return await data.json();
    },
  });

  const { data: outliersData, isLoading: isOutliersLoading } = useQuery({
    queryKey: ["outliers", geneToAnalyze],
    enabled: !!geneToAnalyze,
    queryFn: async () => {
      const data = await fetch(`${baseApiUrl}/outliers?gene=${geneToAnalyze}`);
      return await data.json();
    },
  });

  return (
    <Layout>
      <Typography paddingTop={10} variant="h3" paddingBottom={8}>
        Omics Data Retrieval and Analysis System
      </Typography>
      <Box display="flex" width="100%" gap={1}>
        <SearchField
          selectedGenes={selectedGenes}
          setSelectedGenes={setSelectedGenes}
          onSearchClick={refetch}
        />
      </Box>
      <Box paddingTop={8} display="flex" flexDirection="column" gap={3}>
        <SkeletonLoader isLoading={isGenesTableLoading} height={200}>
          {genesTableData && (
            <GenesTable
              onAnalyzeClick={(gene) => setGeneToAnalyze(gene)}
              genesData={genesTableData}
            />
          )}
        </SkeletonLoader>

        <SkeletonLoader isLoading={isAnalysisLoading} height={180}>
          {analysisData && (
            <AnalysisCard
              geneName={geneToAnalyze}
              mean={analysisData.mean}
              median={analysisData.median}
              variance={analysisData.variance}
            />
          )}
        </SkeletonLoader>

        <SkeletonLoader isLoading={isOutliersLoading} height={380}>
          {outliersData && (
            <AnalysisChart
              geneName={geneToAnalyze}
              analysisData={outliersData}
            />
          )}
        </SkeletonLoader>
      </Box>
    </Layout>
  );
};

export default Homepage;
