import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  plugins,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: any) {
  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Chart.js Pie Chart",
      },
    },
  };

  return <Pie options={options} data={data} />;
}
