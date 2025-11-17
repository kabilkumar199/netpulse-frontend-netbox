import React, { useState, useEffect } from 'react';

interface ApplicationPerformanceMonitorProps {
  onClose?: () => void;
}

interface ApplicationStatus {
  id: string;
  name: string;
  type: 'web' | 'database' | 'email' | 'custom';
  status: 'up' | 'down' | 'warning' | 'unknown';
  responseTime: number;
  availability: number;
  errorRate: number;
  lastCheck: Date;
  checks: ApplicationCheckStatus[];
}

interface ApplicationCheckStatus {
  id: string;
  name: string;
  type: string;
  status: 'up' | 'down' | 'warning';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

interface ApplicationMetrics {
  totalApplications: number;
  upApplications: number;
  downApplications: number;
  warningApplications: number;
  averageResponseTime: number;
  averageAvailability: number;
  totalChecks: number;
  failedChecks: number;
}

const ApplicationPerformanceMonitor: React.FC<ApplicationPerformanceMonitorProps> = ({ onClose }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'applications' | 'checks' | 'dependencies'>('overview');
  const [applicationStatuses, setApplicationStatuses] = useState<ApplicationStatus[]>([]);
  const [applicationMetrics, setApplicationMetrics] = useState<ApplicationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock application data
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);
      
      const mockApplications: ApplicationStatus[] = [
        {
          id: 'app-1',
          name: 'Company Website',
          type: 'web',
          status: 'up',
          responseTime: 245,
          availability: 99.8,
          errorRate: 0.2,
          lastCheck: new Date(),
          checks: [
            {
              id: 'check-1',
              name: 'HTTP Check',
              type: 'http',
              status: 'up',
              responseTime: 245,
              lastCheck: new Date()
            },
            {
              id: 'check-2',
              name: 'HTTPS Check',
              type: 'http',
              status: 'up',
              responseTime: 267,
              lastCheck: new Date()
            }
          ]
        },
        {
          id: 'app-2',
          name: 'Customer Portal',
          type: 'web',
          status: 'up',
          responseTime: 189,
          availability: 99.9,
          errorRate: 0.1,
          lastCheck: new Date(),
          checks: [
            {
              id: 'check-3',
              name: 'Login Page',
              type: 'http',
              status: 'up',
              responseTime: 189,
              lastCheck: new Date()
            },
            {
              id: 'check-4',
              name: 'API Health',
              type: 'http',
              status: 'up',
              responseTime: 156,
              lastCheck: new Date()
            }
          ]
        },
        {
          id: 'app-3',
          name: 'Database Server',
          type: 'database',
          status: 'warning',
          responseTime: 1250,
          availability: 98.5,
          errorRate: 1.5,
          lastCheck: new Date(),
          checks: [
            {
              id: 'check-5',
              name: 'Connection Test',
              type: 'database',
              status: 'warning',
              responseTime: 1250,
              lastCheck: new Date(),
              error: 'High response time detected'
            },
            {
              id: 'check-6',
              name: 'Query Performance',
              type: 'database',
              status: 'up',
              responseTime: 89,
              lastCheck: new Date()
            }
          ]
        },
        {
          id: 'app-4',
          name: 'Email Server',
          type: 'email',
          status: 'up',
          responseTime: 45,
          availability: 99.7,
          errorRate: 0.3,
          lastCheck: new Date(),
          checks: [
            {
              id: 'check-7',
              name: 'SMTP Check',
              type: 'tcp',
              status: 'up',
              responseTime: 45,
              lastCheck: new Date()
            },
            {
              id: 'check-8',
              name: 'IMAP Check',
              type: 'tcp',
              status: 'up',
              responseTime: 52,
              lastCheck: new Date()
            }
          ]
        },
        {
          id: 'app-5',
          name: 'API Gateway',
          type: 'custom',
          status: 'down',
          responseTime: 0,
          availability: 0,
          errorRate: 100,
          lastCheck: new Date(),
          checks: [
            {
              id: 'check-9',
              name: 'API Health Check',
              type: 'http',
              status: 'down',
              responseTime: 0,
              lastCheck: new Date(),
              error: 'Connection timeout'
            }
          ]
        }
      ];
      
      setApplicationStatuses(mockApplications);
      
      // Calculate metrics
      const totalApplications = mockApplications.length;
      const upApplications = mockApplications.filter(app => app.status === 'up').length;
      const downApplications = mockApplications.filter(app => app.status === 'down').length;
      const warningApplications = mockApplications.filter(app => app.status === 'warning').length;
      const averageResponseTime = mockApplications.reduce((sum, app) => sum + app.responseTime, 0) / totalApplications;
      const averageAvailability = mockApplications.reduce((sum, app) => sum + app.availability, 0) / totalApplications;
      const totalChecks = mockApplications.reduce((sum, app) => sum + app.checks.length, 0);
      const failedChecks = mockApplications.reduce((sum, app) => 
        sum + app.checks.filter(check => check.status === 'down').length, 0
      );
      
      setApplicationMetrics({
        totalApplications,
        upApplications,
        downApplications,
        warningApplications,
        averageResponseTime,
        averageAvailability,
        totalChecks,
        failedChecks
      });
      
      setIsLoading(false);
    };
    
    generateMockData();
    
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'up': return 'bg-green-900 text-green-300';
      case 'down': return 'bg-red-900 text-red-300';
      case 'warning': return 'bg-yellow-900 text-yellow-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getApplicationIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐';
      case 'database': return '🗄️';
      case 'email': return '📧';
      case 'custom': return '⚙️';
      default: return '📱';
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatAvailability = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };

  const formatErrorRate = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Application Performance Monitor
          </h2>
          <p className="text-gray-400">
            Monitor application availability, performance, and health
          </p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'applications', label: 'Applications' },
          { key: 'checks', label: 'Health Checks' },
          { key: 'dependencies', label: 'Dependencies' }
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedView(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">Loading application data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && applicationMetrics && (
        <div className="space-y-6">
          {/* Overview */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Total Applications
                </h3>
                <div className="text-2xl font-bold text-blue-400">
                  {applicationMetrics.totalApplications}
                </div>
                <div className="text-sm text-gray-400">
                  Monitored
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Up Applications
                </h3>
                <div className="text-2xl font-bold text-green-400">
                  {applicationMetrics.upApplications}
                </div>
                <div className="text-sm text-gray-400">
                  Healthy
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Avg Response Time
                </h3>
                <div className="text-2xl font-bold text-purple-400">
                  {formatResponseTime(applicationMetrics.averageResponseTime)}
                </div>
                <div className="text-sm text-gray-400">
                  Across all apps
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Avg Availability
                </h3>
                <div className="text-2xl font-bold text-orange-400">
                  {formatAvailability(applicationMetrics.averageAvailability)}
                </div>
                <div className="text-sm text-gray-400">
                  Uptime
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {selectedView === 'applications' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Application Status
              </h3>
              <div className="space-y-4">
                {applicationStatuses.map((app) => (
                  <div key={app.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getApplicationIcon(app.type)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{app.name}</div>
                          <div className="text-sm text-gray-400">
                            {app.type.charAt(0).toUpperCase() + app.type.slice(1)} Application
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Response Time</div>
                          <div className="font-medium text-white">
                            {formatResponseTime(app.responseTime)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Availability</div>
                          <div className="font-medium text-white">
                            {formatAvailability(app.availability)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Error Rate</div>
                          <div className="font-medium text-white">
                            {formatErrorRate(app.errorRate)}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Last check: {formatTimeAgo(app.lastCheck)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {app.checks.length} health checks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Checks */}
          {selectedView === 'checks' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Health Checks
              </h3>
              <div className="space-y-4">
                {applicationStatuses.map((app) => (
                  <div key={app.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="text-xl mr-2">
                        {getApplicationIcon(app.type)}
                      </div>
                      <div className="font-medium text-white">{app.name}</div>
                    </div>
                    <div className="space-y-2">
                      {app.checks.map((check) => (
                        <div key={check.id} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              check.status === 'up' ? 'bg-green-500' :
                              check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <div className="font-medium text-white">{check.name}</div>
                              <div className="text-sm text-gray-400">
                                {check.type.toUpperCase()} • {formatTimeAgo(check.lastCheck)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${getStatusColor(check.status)}`}>
                              {formatResponseTime(check.responseTime)}
                            </div>
                            {check.error && (
                              <div className="text-sm text-red-400">
                                {check.error}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {selectedView === 'dependencies' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Application Dependencies
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🔗</div>
                <div className="text-lg font-medium text-white mb-2">
                  Dependency Mapping
                </div>
                <div className="text-gray-400">
                  Visualize application dependencies and impact analysis
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Dependency Map
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationPerformanceMonitor;

