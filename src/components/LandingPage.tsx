'use client';

interface ServiceQuickView {
  name: string;
  owner?: string;
  cpu: string;
  memory: string;
  podCount: number;
  podsRunning: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
}

// Mock data for services overview
const MOCK_SERVICES: ServiceQuickView[] = [
  {
    name: 'consumption-metric-processor',
    owner: 'waterknights',
    cpu: '245m',
    memory: '512Mi',
    podCount: 2,
    podsRunning: 2,
    status: 'healthy',
  },
  {
    name: 'billing-service',
    owner: 'finance-team',
    cpu: '180m',
    memory: '384Mi',
    podCount: 1,
    podsRunning: 1,
    status: 'healthy',
  },
  {
    name: 'device-description',
    owner: 'data-engineering',
    cpu: '320m',
    memory: '768Mi',
    podCount: 2,
    podsRunning: 2,
    status: 'healthy',
  },
  {
    name: 'flow-service',
    owner: 'platform-team',
    cpu: '420m',
    memory: '1Gi',
    podCount: 3,
    podsRunning: 3,
    status: 'healthy',
  },
  {
    name: 'analytics-engine',
    owner: 'analytics-team',
    cpu: '150m',
    memory: '256Mi',
    podCount: 1,
    podsRunning: 1,
    status: 'healthy',
  },
];

const getStatusColor = (status: 'healthy' | 'degraded' | 'unhealthy') => {
  switch (status) {
    case 'healthy':
      return { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-200', icon: '✅' };
    case 'degraded':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-200', icon: '⚠️' };
    case 'unhealthy':
      return { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-200', icon: '❌' };
  }
};

interface LandingPageProps {
  onServiceSelect: (serviceName: string) => void;
}

export const LandingPage = ({ onServiceSelect }: LandingPageProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Services Overview</h2>
        <p className="text-gray-600">Quick view of all services and their current status</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Services</p>
          <p className="text-3xl font-bold text-blue-600">{MOCK_SERVICES.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Healthy</p>
          <p className="text-3xl font-bold text-green-600">
            {MOCK_SERVICES.filter((s) => s.status === 'healthy').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Degraded</p>
          <p className="text-3xl font-bold text-yellow-600">
            {MOCK_SERVICES.filter((s) => s.status === 'degraded').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Pods Running</p>
          <p className="text-3xl font-bold text-purple-600">
            {MOCK_SERVICES.reduce((sum, s) => sum + s.podsRunning, 0)}/
            {MOCK_SERVICES.reduce((sum, s) => sum + s.podCount, 0)}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SERVICES.map((service) => {
          const statusColors = getStatusColor(service.status);
          const podHealth = service.podsRunning === service.podCount;

          return (
            <button
              key={service.name}
              onClick={() => onServiceSelect(service.name)}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all text-left overflow-hidden cursor-pointer group"
            >
              {/* Header */}
              <div className={`${statusColors.bg} px-6 py-4 border-b border-gray-200`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600">
                      {service.name}
                    </h3>
                    {service.owner && (
                      <p className="text-xs text-gray-600 mt-1">👤 {service.owner}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors.badge} text-black`}>
                    <span>{statusColors.icon}</span>
                    <span className="capitalize">{service.status}</span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Resources */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">CPU Usage</p>
                    <p className="text-lg font-bold text-blue-600">{service.cpu}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Memory</p>
                    <p className="text-lg font-bold text-purple-600">{service.memory}</p>
                  </div>
                </div>

                {/* Pod Status */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-medium mb-2">Pod Status</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${podHealth ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${(service.podsRunning / service.podCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-gray-700">
                      {service.podsRunning}/{service.podCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                  View Details →
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">ℹ️ Tip:</span> Click on any service card to view detailed
          configuration, specifications, and real-time status information.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
