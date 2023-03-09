import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
import {ScatterChartDataProps} from '../../interfaces/props'


const ScatterChart = ({scatterChartData}:ScatterChartDataProps)=>{
    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem:any) {
                        return ("Name : " + tooltipItem.raw.labeldata + " (NDR : " + tooltipItem.parsed.y + ", SD : " + tooltipItem.parsed.x+")")
                         
                    }
                }}}
      };
      
       const data = {
        datasets: [
          {
            label: "Stock Plots",
            data: scatterChartData,
            backgroundColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      };
    return(
         <Scatter options={options} data={data} />
    )

}

export default ScatterChart;


