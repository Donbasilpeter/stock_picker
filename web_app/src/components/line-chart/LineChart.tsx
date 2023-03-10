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
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  zoomPlugin,
  Tooltip,
  Legend
);



const LineChart = ({LineChartData}) => {
  const options:any = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {

  
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
    labels: LineChartData.normalisedData?.map((data:any)=>data.dttm),
    datasets: [{
      label: 'My First Dataset',
      data: LineChartData.normalisedData?.map((data:any)=>data.normalisedData),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  return (
   <Line options={options} data={data} />
  )
};

export default LineChart;
