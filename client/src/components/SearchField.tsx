import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Button, TextField } from "@mui/material";
import { baseApiUrl } from "../api";

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
    queryKey: ["geneNames", debouncedSearchValue],
    enabled: debouncedSearchValue.length > 2,
    queryFn: async () => {
      const data = await fetch(`${baseApiUrl}?search=${debouncedSearchValue}`);
      return await data.json();
    },
  });

  return (
    <>
      <Autocomplete
        loading={isGeneNamesLoading}
        multiple
        fullWidth
        noOptionsText={
          debouncedSearchValue.length > 2 ? "No result" : "Type to search"
        }
        inputValue={input}
        value={selectedGenes}
        onChange={(_, newValue: string[] | null) => {
          if (newValue) {
            setSelectedGenes(newValue);
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
