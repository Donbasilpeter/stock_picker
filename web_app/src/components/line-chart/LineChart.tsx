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
import moment from 'moment'
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
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      tension: 0.1,
    });

    const [formattedPortfolioIdealData, setFormattedPortfolioIdealData] =
    useState<DataSetInterface>({
      label: "IDEAL",
      data: portfolioData.Ideal.map((data: any) => data.value),
      fill: false,
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main,
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
              borderWidth: 1,
              borderColor:
                lineChartData.length === 1 ? theme.palette.primary.main : color,
              backgroundColor:
                lineChartData.length === 1
                  ? theme.palette.primary.main
                  : color,

              color:
                lineChartData.length === 1 ? theme.palette.primary.main : color,

              tension: 0.1,
              hidden: lineChartData.length!=1 ,
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
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      tension: 0.1,
      borderWidth: 1,

    };
    setFormattedPortfolioData(portfolio);
    const ideal = {
      label: "IDEAL",
      data: portfolioData.Ideal.map((data: any) => data.value),
      fill: false,
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main,
      tension: 0.1,
      borderWidth: 1,

    };
    setFormattedPortfolioIdealData(ideal);
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
          mode: "x",

        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
    },
  };

  const data = {
    labels: lineChartData[0]?.normalisedData?.map((data: any) => moment(data.dttm).format('YYYY-MM-DD')),
    datasets: formattedPortfolioData.data.length>0 && isPortfolio? [...formattedLineChartData,formattedPortfolioData,formattedPortfolioIdealData ] : formattedLineChartData
  };
  return <Line options={options} data={data} />;
};

export default LineChart;
