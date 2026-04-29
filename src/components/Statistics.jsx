import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController,
  LineController,
  BubbleController,
  ScatterController,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController,
  LineController,
  BubbleController,
  ScatterController
);

const LABELS = [
  "Healthy",
  "Diagnosed",
  "Under Treatment",
  "Recovered",
  "With Disability",
];

const COLORS = ["#A5E3F9", "#29A888", "#0F52BA", "#ed29ff", "#ff29bb"];

export default function Statistics({
  barValues = [3, 5, 2, 4, 1],
  pieValues = [3, 5, 2, 4, 1],
  doughnutValues = [3, 5, 2, 4, 1],
  lineValues = [3, 5, 2, 4, 1],
}) {
  const barData = {
    labels: LABELS,
    datasets: [
      {
        label: "Population Health Status",
        data: barValues,
        backgroundColor: COLORS,
      },
    ],
  };

  const pieData = {
    labels: LABELS,
    datasets: [
      {
        label: "Population Health Status",
        data: pieValues,
        backgroundColor: COLORS,
      },
    ],
  };

  const doughnutData = {
    labels: LABELS,
    datasets: [
      {
        label: "Disease & Diagnosis Data",
        data: doughnutValues,
        backgroundColor: COLORS,
      },
    ],
  };

  const lineData = {
    labels: LABELS,
    datasets: [
      {
        label: "Disability & Functional Status",
        data: lineValues,
        borderColor: "#3b82f6",
        backgroundColor: "#93c5fd",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Bar data={barData} options={options} />
        </div>

        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Pie data={pieData} options={options} />
        </div>

        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Doughnut data={doughnutData} options={options} />
        </div>

        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Line data={lineData} options={options} />
        </div>
      </div>
    </div>
  );
}