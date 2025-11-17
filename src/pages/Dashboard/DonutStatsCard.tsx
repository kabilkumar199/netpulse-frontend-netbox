// src/components/charts/DonutStatsCard.tsx
import { 
  AlertTriangle, 
  Loader2, 
  HelpCircle // Default icon
} from 'lucide-react';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { AlertSkeleton } from './AlertSkeleton';
// --- 1. Define Props ---
interface DonutStatsCardProps {
  title: string;
  data: { [key: string]: number };
  colors: { [key: string]: string };
  icons: { [key: string]: React.ElementType }; // Pass icons as a prop
  isLoading?: boolean;
  error?: string | null;
}

// --- 2. Define the StatItem sub-component ---
interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: number;
  total: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, total, color }) => {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

  return (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
        style={{ backgroundColor: color }} // Use solid color for icon bg
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-300 capitalize">{label}</div>
        <div className="text-xs text-gray-400">
          {value} ({percentage}%)
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Card Component ---
const DonutStatsCard: React.FC<DonutStatsCardProps> = ({ 
  title, 
  data, 
  colors, 
  icons, 
  isLoading = false, 
  error = null 
}) => {
  
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // --- 4. Transform data for ApexCharts (filters out 0s) ---
  const series = Object.values(data).filter(val => val > 0);
  const labels = Object.keys(data).filter(key => data[key] > 0);
  const chartColors = Object.keys(data).filter(key => data[key] > 0).map(key => colors[key] || '#8884d8');

  // --- 5. ApexCharts options ---
  const options: ApexOptions = {
    chart: { type: 'donut', foreColor: '#9ca3af', background: 'transparent' },
    series: series,
    labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    colors: chartColors,
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontWeight: 600,
              color: '#ffffff',
              formatter: () => total.toString()
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false }, // We use our custom boxes as the legend
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      y: { 
        formatter: (val: number) => val.toString(),
        title: { 
          formatter: (seriesName: string) => seriesName
        }
      }
    },
    stroke: { show: false },
  };

  // --- 6. Create stat items DYNAMICALLY ---
  const statItems = Object.keys(data).map(key => ({
    icon: icons[key] || HelpCircle,
    label: key,
    value: data[key],
    color: colors[key] || '#8884d8',
  }));

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 h-full"> 
      <h3 className="text-lg font-semibold text-white mb-4">
        {title}
      </h3>
      
      {isLoading ? (
        <>
          <AlertSkeleton />
          <AlertSkeleton />
          <AlertSkeleton />
          <AlertSkeleton />
        </>

      ) : error ? (
        <div className="flex flex-col items-center justify-center my-6 h-48 text-red-400">
          <AlertTriangle className="w-12 h-12 mb-2" />
          <p className="font-semibold text-center">{error}</p>
        </div>
      ) : (
        <>
        <div className="w-full"> 
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={220}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statItems.map(item => (
              <StatItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                total={total}
                color={item.color}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DonutStatsCard;