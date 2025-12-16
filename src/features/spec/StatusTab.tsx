'use client';

interface StatusTabProps {
  metadata?: Record<string, any>;
  spec?: Record<string, any>;
}

interface PodStatus {
  name: string;
  state: 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff';
  cpu: string;
  memory: string;
}

interface ServiceStatus {
  name: string;
  cpu: string;
  memory: string;
  pods: PodStatus[];
}

// Mock data for service statuses
const getMockServiceStatus = (serviceName: string): ServiceStatus => {
  const mockData: Record<string, ServiceStatus> = {
    'consumption-metrics': {
      name: 'consumption-metrics',
      cpu: '245m',
      memory: '512Mi',
      pods: [
        { name: 'consumption-metrics-pod-1', state: 'Running', cpu: '120m', memory: '256Mi' },
        { name: 'consumption-metrics-pod-2', state: 'Running', cpu: '125m', memory: '256Mi' },
      ],
    },
    'billing-service': {
      name: 'billing-service',
      cpu: '180m',
      memory: '384Mi',
      pods: [
        { name: 'billing-service-pod-1', state: 'Running', cpu: '180m', memory: '384Mi' },
      ],
    },
    'device-service': {
      name: 'device-service',
      cpu: '320m',
      memory: '768Mi',
      pods: [
        { name: 'device-service-pod-1', state: 'Running', cpu: '160m', memory: '384Mi' },
        { name: 'device-service-pod-2', state: 'Running', cpu: '160m', memory: '384Mi' },
      ],
    },
  };

  return (
    mockData[serviceName] || {
      name: serviceName,
      cpu: '100m',
      memory: '256Mi',
      pods: [
        { name: `${serviceName}-pod-1`, state: 'Running', cpu: '100m', memory: '256Mi' },
      ],
    }
  );
};

const getStateColor = (state: string) => {
  switch (state) {
    case 'Running':
      return { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-200' };
    case 'Pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-200' };
    case 'Failed':
      return { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-200' };
    case 'CrashLoopBackOff':
      return { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200' };
  }
};

const getStateIcon = (state: string) => {
  switch (state) {
    case 'Running':
      return '✅';
    case 'Pending':
      return '⏳';
    case 'Failed':
      return '❌';
    case 'CrashLoopBackOff':
      return '🔄';
    default:
      return '❓';
  }
};

export const StatusTab = ({ metadata, spec }: StatusTabProps) => {
  const serviceName = metadata?.name || 'Unknown Service';
  const serviceStatus = getMockServiceStatus(serviceName);

  return (
    <div className="space-y-6">
      {/* Service Overview Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-lg font-bold text-white">📊 Service Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Name */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-2">Service Name</p>
              <p className="text-2xl font-bold text-gray-600">{serviceStatus.name}</p>
            </div>

            {/* CPU Usage */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-600 text-sm font-medium mb-2">CPU Usage</p>
              <p className="text-3xl font-bold text-blue-700">{serviceStatus.cpu}</p>
              <p className="text-xs text-blue-600 mt-1">Aggregated across all pods</p>
            </div>

            {/* Memory Usage */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-600 text-sm font-medium mb-2">Memory Usage</p>
              <p className="text-3xl font-bold text-purple-700">{serviceStatus.memory}</p>
              <p className="text-xs text-purple-600 mt-1">Aggregated across all pods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pods Status */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h3 className="text-lg font-bold text-white">
            🚀 Pod Status ({serviceStatus.pods.length} pods running)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pod Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Memory
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serviceStatus.pods.map((pod, index) => {
                const stateColors = getStateColor(pod.state);
                const stateIcon = getStateIcon(pod.state);

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{pod.name}</code>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${stateColors.badge} text-black`}
                      >
                        <span>{stateIcon}</span>
                        <span>{pod.state}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700">{pod.cpu}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700">{pod.memory}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">ℹ️ Note:</span> This data is currently mocked. In production, this will
          pull real-time metrics from the Kubernetes cluster.
        </p>
      </div>
    </div>
  );
};

export default StatusTab;
