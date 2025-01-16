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
import MarketViewer from "./components/market-viewer/MarketViewer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StockAnalysis from "./components/stock-analysis/StockAnalysis";
import PortfolioAnalysis from "./components/portfolio-analysis/PortfolioAnalysis";

let theme = createTheme({
  palette: {
    primary: {
      main: '#0088c2', // Main color for primary
      light: '#00adc1', // Optional light shade
      dark: '#2660a4', // Optional dark shade
      contrastText: '#ffffff', // Text color on primary
    },
    secondary: {
      main: '#88416b',
      light: '#d87289',
      dark: '#9e3e57',
      contrastText: '#ffffff',
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
        <Box component="main" sx={{ height: "100vh", width: "100vw" }}>

          <CssBaseline />
          <BrowserRouter>

            <Routes>

              <Route path="/" element={<Header />}>

                <Route path="*" element={<MarketViewer />} />
                <Route path="/stock-analysis/:scripcode" element={<StockAnalysis />} />
                <Route path="/P-Generator" element={<PortfolioAnalysis />} />


                
              </Route>
            </Routes>

          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
