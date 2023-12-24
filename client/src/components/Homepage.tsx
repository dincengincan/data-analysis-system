import { useQuery } from "@tanstack/react-query";
import { GenesTable } from "./GenesTable";
import { Layout } from "./Layout";
import { useState } from "react";
import { AnalysisCard } from "./AnalysisCard";
import { AnalysisChart } from "./AnalysisChart";
import {
  Autocomplete,
  Box,
  Button,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";

const Homepage = () => {
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [geneToAnalyze, setGeneToAnalyze] = useState("");
  const [input, setInput] = useState("");

  const debouncedSearchValue = useDebounce(input);

  const {
    data: genesTableData,
    isLoading: isGenesTableLoading,
    refetch,
  } = useQuery({
    queryKey: ["geneDetails"],
    enabled: false,
    queryFn: async () => {
      const apiUrl = new URL("http://localhost:8080/api/genes/gene");
      selectedGenes.forEach((gene) => apiUrl.searchParams.append("name", gene));

      const data = await fetch(apiUrl);
      return await data.json();
    },
  });

  const { data: geneNames, isLoading: isGeneNamesLoading } = useQuery({
    queryKey: ["geneNames"],
    enabled: debouncedSearchValue.length > 2,
    queryFn: async () => {
      const data = await fetch(
        `http://localhost:8080/api/genes?search=${debouncedSearchValue}`
      );
      return await data.json();
    },
  });

  const { data: analysisData, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ["analysis", geneToAnalyze],
    enabled: !!geneToAnalyze,
    queryFn: async () => {
      const data = await fetch(
        `http://localhost:8080/api/genes/analysis?gene=${geneToAnalyze}`
      );
      return await data.json();
    },
  });

  const { data: outliersData, isLoading: isOutliersLoading } = useQuery({
    queryKey: ["outliers", geneToAnalyze],
    enabled: !!geneToAnalyze,
    queryFn: async () => {
      const data = await fetch(
        `http://localhost:8080/api/genes/outliers?gene=${geneToAnalyze}`
      );
      return await data.json();
    },
  });

  return (
    <Layout>
      <Typography paddingBottom={8} fontSize="xxx-large">
        Genes
      </Typography>
      <Box display="flex" width="100%" gap={1}>
        <Autocomplete
          loading={isGeneNamesLoading}
          multiple
          fullWidth
          noOptionsText="Type to search"
          inputValue={input}
          value={selectedGenes}
          onChange={(_, newValue: string[] | null) => {
            if (newValue) {
              setSelectedGenes(newValue);
              setInput("");
            }
          }}
          onInputChange={(_, newInputValue) => {
            setInput(newInputValue);
          }}
          options={geneNames ?? []}
          renderInput={(params) => <TextField {...params} label="Gene ID" />}
        />
        <Button
          disabled={selectedGenes.length < 1}
          variant="outlined"
          onClick={() => refetch()}
        >
          Search
        </Button>
      </Box>
      <Box paddingTop={8} display="flex" flexDirection="column" gap={3}>
        {genesTableData?.error ? (
          <p>{genesTableData.error}</p>
        ) : (
          genesTableData && (
            <GenesTable
              onAnalyzeClick={(gene) => setGeneToAnalyze(gene)}
              isLoading={isGenesTableLoading}
              genesData={genesTableData}
            />
          )
        )}

        {isAnalysisLoading ? (
          <Skeleton height="340px" width="100%" />
        ) : (
          analysisData && (
            <AnalysisCard
              geneName={geneToAnalyze}
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
              geneName={geneToAnalyze}
              analysisData={outliersData}
            />
          )
        )}
      </Box>
    </Layout>
  );
};

export default Homepage;
