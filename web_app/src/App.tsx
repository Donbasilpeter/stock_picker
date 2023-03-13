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
      main: "#F55050",
    },
    secondary: {
      main: "#F48484",
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
