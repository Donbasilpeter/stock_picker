import { useRef, useEffect } from "react";
import "./App.scss";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/header/Header";


let theme = createTheme({
  palette: {
    primary: {
      main: "#D61355",
    },
    secondary: {
      main: "#F1E5EA",
    },
  },
  typography: {
    fontFamily: ["Quicksand", "sans-serif"].join(","),
    h6: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
  },
});
theme = responsiveFontSizes(theme);

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box>
          <CssBaseline />
          <Header />

        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
