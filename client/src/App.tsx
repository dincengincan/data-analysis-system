import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "./pages/Homepage";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Homepage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
