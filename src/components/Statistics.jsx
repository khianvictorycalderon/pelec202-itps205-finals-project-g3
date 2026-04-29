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

const COLORS = ["#06b6d4", "#14b8a6", "#0ea5e9", "#a855f7", "#ec4899"];

export default function Statistics({
  barValues = [3, 5, 2, 4, 1],
  pieValues = [3, 5, 2, 4, 1],
  doughnutValues = [3, 5, 2, 4, 1],
  lineValues = [3, 5, 2, 4, 1],
}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          font: { size: 10 },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: { color: "#475569" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#475569" },
        grid: { color: "rgba(100, 116, 139, 0.15)" },
      },
    },
  };

  const barData = {
    labels: LABELS,
    datasets: [
      {
        label: "Health Status",
        data: barValues,
        backgroundColor: COLORS,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: LABELS,
    datasets: [
      {
        label: "Health Status",
        data: pieValues,
        backgroundColor: COLORS,
        borderWidth: 0,
      },
    ],
  };

  const doughnutData = {
    labels: LABELS,
    datasets: [
      {
        label: "Diagnosis Overview",
        data: doughnutValues,
        backgroundColor: COLORS,
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const lineData = {
    labels: LABELS,
    datasets: [
      {
        label: "Trend",
        data: lineValues,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#06b6d4",
      },
    ],
  };

  const ChartCard = ({ children }) => (
    <div className="h-[220px] bg-white rounded-xl p-3 shadow-md border border-neutral-200 flex items-center justify-center">
      <div className="w-full h-full">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-slate-800 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Global Health Statistics
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Population health insights and distribution overview
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">

          <ChartCard>
            <Bar data={barData} options={options} />
          </ChartCard>

          <ChartCard>
            <Pie data={pieData} options={options} />
          </ChartCard>

          <ChartCard>
            <Doughnut data={doughnutData} options={options} />
          </ChartCard>

          <ChartCard>
            <Line data={lineData} options={options} />
          </ChartCard>

        </div>
      </div>
    </div>
  );
}