import {
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type GenesTableProps = {
  isLoading: boolean;
  genesData?: Gene[];
  onAnalyzeClick: (gene: string) => void;
};

type Gene = {
  _id: string;
  gene: string;
  transcript: string;
  control_rep1: number;
  control_rep2: number;
  control_rep3: number;
  exper_rep1: number;
  exper_rep2: number;
  exper_rep3: number;
};

export const GenesTable = ({
  isLoading,
  genesData,
  onAnalyzeClick,
}: GenesTableProps) => {
  const tableContent = (
    <TableContainer component={Paper}>
      <Table padding="normal">
        <TableHead>
          <TableRow>
            <TableCell>Gene</TableCell>
            <TableCell>Transcript</TableCell>
            <TableCell>Control Rep 1</TableCell>
            <TableCell>Control Rep 2</TableCell>
            <TableCell>Control Rep 3</TableCell>
            <TableCell>Exper Rep 1</TableCell>
            <TableCell>Exper Rep 2</TableCell>
            <TableCell>Exper Rep 3</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {genesData?.map((gene) => (
            <TableRow key={gene._id}>
              <TableCell>{gene.gene}</TableCell>
              <TableCell>{gene.transcript}</TableCell>
              <TableCell>{gene.control_rep1}</TableCell>
              <TableCell>{gene.control_rep2}</TableCell>
              <TableCell>{gene.control_rep3}</TableCell>
              <TableCell>{gene.exper_rep1}</TableCell>
              <TableCell>{gene.exper_rep2}</TableCell>
              <TableCell>{gene.exper_rep3}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => onAnalyzeClick(gene.gene)}
                >
                  Analyze
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (isLoading) {
    return (
      <Skeleton height="200px" width="100%">
        {tableContent}
      </Skeleton>
    );
  }

  return tableContent;
};
