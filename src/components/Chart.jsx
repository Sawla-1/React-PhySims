import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  zoomPlugin
);


const Chart = (props)=> {

  return (
    <div className="chart">
        <span>Position: {props.initialPosition.toFixed(2)} m</span>
        <span>Time: {props.time.toFixed(2)} s</span>
        <span>Velocity: {props.velocity.toFixed(2)} m/s</span>
        <Line data={props.chartData} options={props.options} />
  </div>
  )
}

export default Chart;