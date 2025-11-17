import React from 'react';
import { Search, Map, Route, BarChart3 } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'discover',
      title: 'Discover Network',
      description: 'Start a new network discovery scan',
      icon: Search,
      color: 'blue',
      href: '/discover/scan'
    },
    {
      id: 'topology',
      title: 'View Topology',
      description: 'Open network topology map',
      icon: Map,
      color: 'green',
      href: '/network/topology'
    },
    {
      id: 'path-analysis',
      title: 'Path Analysis',
      description: 'Analyze network paths and reachability',
      icon: Route,
      color: 'purple',
      href: '/analyze/paths'
    },
    {
      id: 'reports',
      title: 'Generate Report',
      description: 'Create network inventory report',
      icon: BarChart3,
      color: 'orange',
      href: '/analyze/reports'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-900/20 hover:bg-blue-900/30 border-blue-700 text-blue-300 hover:text-blue-200',
    green: 'bg-green-900/20 hover:bg-green-900/30 border-green-700 text-green-300 hover:text-green-200',
    purple: 'bg-purple-900/20 hover:bg-purple-900/30 border-purple-700 text-purple-300 hover:text-purple-200',
    orange: 'bg-orange-900/20 hover:bg-orange-900/30 border-orange-700 text-orange-300 hover:text-orange-200'
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`block p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${colorClasses[action.color]}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">
                  {action.title}
                </h4>
                <p className="text-xs opacity-75 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

