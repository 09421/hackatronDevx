'use client';

import { useState } from 'react';

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
  const [openNamespaces, setOpenNamespaces] = useState<Record<string, boolean>>({
    Flow: true,
    Billing: true,
    Consumption: true,
  });

  const toggleNamespace = (ns: string) =>
    setOpenNamespaces((s) => ({ ...s, [ns]: !s[ns] }));

  // Define the namespaces and how to match services
  const NAMESPACES: { key: string; label: string; matcher: (name: string) => boolean }[] = [
    { key: 'flow', label: 'Flow', matcher: (n) => /flow/i.test(n) || /device-description/i.test(n) },
    { key: 'billing', label: 'Billing', matcher: (n) => /billing/i.test(n) },
    { key: 'consumption', label: 'Consumption', matcher: (n) => /consumption/i.test(n) },
  ];

  // group services by namespace
  const grouped: Record<string, ServiceQuickView[]> = {};
  NAMESPACES.forEach((ns) => {
    grouped[ns.label] = MOCK_SERVICES.filter((s) => ns.matcher(s.name));
  });

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
          <p className="text-3xl font-bold text-blue-600">{MOCK_SERVICES.length - 1}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Pods Running</p>
          <p className="text-3xl font-bold text-purple-600">
            {MOCK_SERVICES.reduce((sum, s) => sum + s.podsRunning, 0)}/
            {MOCK_SERVICES.reduce((sum, s) => sum + s.podCount, 0)}
          </p>
        </div>
      </div>

      {/* Namespaced Collapsible Sections */}
      <div className="space-y-4">
        {Object.keys(grouped).map((label) => {
          const services = grouped[label];
          return (
            <div key={label} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleNamespace(label)}
                className="w-full text-left px-6 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200 border-b border-gray-200"
              >
                <h3 className="font-semibold text-lg text-gray-900">{label}</h3>
                <span className="text-sm text-gray-700">{openNamespaces[label] ? '−' : '+'}</span>
              </button>

              {openNamespaces[label] && (
                <div className="p-6">
                  {services.length === 0 ? (
                    <p className="text-sm text-gray-500">No services in this namespace</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => {
                        return (
                          <div
                            key={service.name}
                            role="button"
                            tabIndex={0}
                            onClick={() => onServiceSelect(service.name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') onServiceSelect(service.name);
                            }}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all text-left overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            <div className="px-4 py-3 border-b border-gray-200 bg-white">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-md text-gray-900 truncate">{service.name}</h4>
                                  {service.owner && (
                                    <p className="text-xs text-gray-600 mt-1">👤 {service.owner}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`https://gitlab.example.com/${service.name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:opacity-80"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Open GitLab"
                                    title="Open GitLab"
                                  >
                                    <img src="/gitlab-logo-500-rgb.svg" alt="GitLab" className="w-16 h-16 hover:scale-110 transition-transform" />
                                  </a>
                                  <a
                                    href={`https://grafana.example.com/dashboard/${service.name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:opacity-80"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Open Grafana"
                                    title="Open Grafana"
                                  >
                                    <img src="/Grafana_logo.svg" alt="Grafana" className="w-8 h-8 hover:scale-110 transition-transform" />
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-center">
                              <p className="text-xs font-medium text-blue-600">View Details →</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
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
