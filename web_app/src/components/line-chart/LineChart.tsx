import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  DataSetInterface,
  LineDataInterfaceProps,
} from "../../interfaces/props";
import { Box, Grid, useTheme } from "@mui/material";
import { SelectedStockData } from "../../interfaces/store";
import { useEffect, useState } from "react";
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  zoomPlugin,
  Tooltip,
  Legend
);

const LineChart = ({
  lineChartData,
  portfolioData,
  isPortfolio=false
}: LineDataInterfaceProps) => {
  const theme = useTheme();
  const [formattedLineChartData, setFormattedLineChartData] = useState<
    DataSetInterface[]
  >([]);
  const [formattedPortfolioData, setFormattedPortfolioData] =
    useState<DataSetInterface>({
      label: "PORTFOLIO",
      data: portfolioData.Data.map((data: any) => data.portfolioValue),
      fill: false,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
      tension: 0.1,
    });

  useEffect(() => {
    let formatedData =
      lineChartData && lineChartData.length > 0
        ? lineChartData?.map((eachStockData: SelectedStockData) => {
            const color =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            return {
              label: eachStockData.Scripname,
              data: eachStockData.normalisedData?.map(
                (data: any) => data.normalisedData
              ),
              fill: false,
              borderColor:
                lineChartData.length === 1 ? theme.palette.primary.main : color,
              backgroundColor:
                lineChartData.length === 1
                  ? theme.palette.secondary.main
                  : color,

              color:
                lineChartData.length === 1 ? theme.palette.primary.main : color,

              tension: 0.1,
            };
          })
        : [];
    setFormattedLineChartData(formatedData);
  }, [lineChartData]);

  useEffect(() => {
    const portfolio = {
      label: "Portfolio",
      data: portfolioData.Data.map((data: any) => data.portfolioValue),
      fill: false,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
      tension: 0.1,
    };
    setFormattedPortfolioData(portfolio);
  }, [portfolioData]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },

    pointRadius: 0,
    plugins: {
      legend: {
        labels: {
          usePointStyle: "true",
          pointStyle: "rectRounded",
          color: theme.palette.primary.main,
        },
      },

      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
          limits: {
            y: { max: 1000 },
          },
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },
  };

  const data = {
    labels: lineChartData[0]?.normalisedData?.map((data: any) => data.dttm),
    datasets: formattedPortfolioData.data.length>0 && isPortfolio? [...formattedLineChartData,formattedPortfolioData ] : formattedLineChartData
  };
  return <Line options={options} data={data} />;
};

export default LineChart;
