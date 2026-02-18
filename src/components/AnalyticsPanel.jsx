import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

function asChartData(series, label, color) {
  return {
    labels: series.map((d) => d.label),
    datasets: [{ label, data: series.map((d) => d.value), backgroundColor: color, borderColor: color }],
  };
}

export default function AnalyticsPanel({ analytics }) {
  return (
    <section className="panel space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">Progress Tracking</h2>
        <span className="rounded bg-slate-100 px-2 py-1 text-sm">Streak: {analytics.streak} days</span>
        <span className="rounded bg-slate-100 px-2 py-1 text-sm">Productivity score: {analytics.productivityScore}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Daily Hours</h3>
          <Line data={asChartData(analytics.daily, 'Daily Hours', '#1d4ed8')} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Weekly Hours</h3>
          <Bar data={asChartData(analytics.weekly, 'Weekly Hours', '#16a34a')} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Monthly Hours</h3>
          <Bar data={asChartData(analytics.monthly, 'Monthly Hours', '#9333ea')} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Total Hours per Subject</h3>
          <Doughnut data={asChartData(analytics.bySubject, 'Hours', ['#1d4ed8', '#0ea5e9', '#9333ea', '#16a34a', '#f59e0b'])} />
        </div>
      </div>
    </section>
  );
}
