import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  zoomPlugin,
  Tooltip,
  Legend
);
import { ScatterChartDataProps } from "../../interfaces/props";
import { Box } from "@mui/material";

const ScatterChart = ({ scatterChartData,labelAndApicall,onSelection }: ScatterChartDataProps) => {
  const options:any = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: onSelection,
    plugins: {
      tooltip: {
        callbacks: {
          label: labelAndApicall
        },
      },
  
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan:{
          enabled:true,
          mode:"xy",
        }
      }
    }
  };

  const data = {
    datasets: [
      {
        label: "Stock Plots",
        data: scatterChartData,
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
  return (
   <Scatter options={options} data={data} />
  )
};

export default ScatterChart;
