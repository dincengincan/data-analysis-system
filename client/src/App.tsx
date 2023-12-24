import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "./components/Homepage";
import { ChakraProvider } from "@chakra-ui/react";
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
  const queryClient = new QueryClient();

  console.log(theme);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Homepage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
