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
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

// Register all Chart.js components we need
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

const LABELS = ["Healthy", "Diagnosed", "Under Treatment", "Recovered", "With Disability"];
const COLORS = ["#A5E3F9", "#29A888", "#0F52BA", "#ed29ff", "#ff29bb"];
const INITIAL_VALUES = [3, 5, 2, 4, 1];

export default function App() {
  const [values, setValues] = useState<number[]>(INITIAL_VALUES);

  const handleChangeValue = (index: number, value: number) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  // Derived chart data
  const barData: ChartData<"bar", number[], string> = {
    labels: LABELS,
    datasets: [{ label: "Population Health Status", data: values, backgroundColor: COLORS }],
  };

  const pieData: ChartData<"pie", number[], string> = {
    labels: LABELS,
    datasets: [{ label: "Population Health Status", data: values, backgroundColor: COLORS }],
  };

  const doughnutData: ChartData<"doughnut", number[], string> = {
    labels: LABELS,
    datasets: [{ label: "Disease & Diagnosis Data", data: values, backgroundColor: COLORS }],
  };

  const lineData: ChartData<"line", number[], string> = {
    labels: LABELS,
    datasets: [{ label: "Disability & Functional Status", data: values, borderColor: "#3b82f6", backgroundColor: "#93c5fd", fill: true }],
  };

 
  const barOptions: ChartOptions<"bar"> = { responsive: true, plugins: { legend: { position: "top" } } };
  const pieOptions: ChartOptions<"pie"> = { responsive: true, plugins: { legend: { position: "top" } } };
  const doughnutOptions: ChartOptions<"doughnut"> = { responsive: true, plugins: { legend: { position: "top" } } };
  const lineOptions: ChartOptions<"line"> = { responsive: true, plugins: { legend: { position: "top" } } };
 
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 bg-gray-100 min-h-screen">
      {/* Inputs */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {LABELS.map((item, index) => (
          <div key={item} className="flex flex-col items-center">
            <label className="mb-1 font-medium">{item}</label>
            <input
              type="number"
              className="w-20 p-1 border-2 border-black rounded text-center"
              value={values[index] || undefined}
              onChange={(e) => handleChangeValue(index, Number(e.target.value || 0))}
            />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="h-[300px] bg-white p-4 rounded-xl shadow">
          <Line data={lineData} options={lineOptions} />
        </div>
        
      </div>
    </div>
  );
}