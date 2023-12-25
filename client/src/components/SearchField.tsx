import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Button, TextField } from "@mui/material";

type SearchFieldProps = {
  onSearchClick: () => void;
  selectedGenes: string[];
  setSelectedGenes: (genes: string[]) => void;
};

export const SearchField = ({
  onSearchClick,
  selectedGenes,
  setSelectedGenes,
}: SearchFieldProps) => {
  const [input, setInput] = useState("");

  const debouncedSearchValue = useDebounce(input);

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

  return (
    <>
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
        onClick={onSearchClick}
      >
        Search
      </Button>
    </>
  );
};
