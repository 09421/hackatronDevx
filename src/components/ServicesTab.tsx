'use client';

import { ServiceConfig } from '@/lib/yamlParser';
import ServiceNetworkDiagram from './ServiceNetworkDiagram';

interface ServicesTabProps {
  services: ServiceConfig[];
  metadata?: Record<string, any>;
  spec?: Record<string, any>;
}

export const ServicesTab = ({ services, metadata = {}, spec = {} }: ServicesTabProps) => {
  return (
    <div className="space-y-6">
      {/* Network Diagram */}
      <ServiceNetworkDiagram metadata={metadata} spec={spec} />
      {services.map((service, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{service.name || `Service ${index + 1}`}</h3>
                {service.description && (
                  <p className="text-blue-100 text-sm mt-1">{service.description}</p>
                )}
              </div>
              {service.version && (
                <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  v{service.version}
                </span>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 space-y-6">
            {/* Kubernetes Configuration */}
            {service.k8s && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Kubernetes Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {service.k8s.memory && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">Memory Limit</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{service.k8s.memory}</p>
                    </div>
                  )}
                  {service.k8s.cpu && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">CPU Limit</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">{service.k8s.cpu}</p>
                    </div>
                  )}
                  {service.k8s.replicas !== undefined && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">Replicas</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">{service.k8s.replicas}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dependencies */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                External Dependencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`border-2 rounded-lg p-4 flex items-center justify-between ${
                    service.database
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🗄️</span>
                    <span className="font-medium text-gray-700">Database</span>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      service.database ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 flex items-center justify-between ${
                    service.kafka
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📨</span>
                    <span className="font-medium text-gray-700">Kafka</span>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      service.kafka ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 flex items-center justify-between ${
                    service.redis
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⚡</span>
                    <span className="font-medium text-gray-700">Redis</span>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      service.redis ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Additional Custom Fields */}
            {Object.keys(service).some(
              (key) => !['name', 'version', 'description', 'k8s', 'database', 'kafka', 'redis'].includes(key)
            ) && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Custom Fields
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                  {Object.entries(service)
                    .filter(
                      ([key]) =>
                        !['name', 'version', 'description', 'k8s', 'database', 'kafka', 'redis'].includes(
                          key
                        )
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-700 font-medium capitalize">{key}:</span>
                        <span className="text-gray-600 text-right max-w-xs">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesTab;
