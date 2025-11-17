// src/components/charts/StatsCard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Loader2, AlertTriangle } from 'lucide-react';
import  {AlertSkeleton}  from '../../pages/Dashboard/AlertSkeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number | string; // Allow string
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  subtitle,
  isLoading = false,
  error = null
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white',
    indigo: 'bg-indigo-500 text-white'
  };

  const changeColorClasses = {
    increase: 'text-green-400',
    decrease: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">
            {title}
          </p>

          {isLoading ? (
            <AlertSkeleton />
          ) : error ? (
            <p className="text-xl font-bold text-red-400 mt-1 truncate" title={error}>
              {error}
            </p>
          ) : (
            <p className="text-2xl font-bold text-white mt-1">
              {value}
            </p>
          )}

          {subtitle && !isLoading && !error && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}

          {change && !isLoading && !error && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${changeColorClasses[change.type]} flex items-center`}>
                {change.type === 'increase' && <TrendingUp className="w-3 h-3 mr-1" />}
                {change.type === 'decrease' && <TrendingDown className="w-3 h-3 mr-1" />}
                {change.type === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
                {change.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {change.type !== 'neutral' ? '%' : ''}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${error ? 'bg-red-500 text-white' : colorClasses[color]} flex items-center justify-center shadow-lg`}>
          {error ? <AlertTriangle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;