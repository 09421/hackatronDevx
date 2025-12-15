'use client';

import { K8sConfig } from '@/lib/yamlParser';

interface K8sConfigVisualizerProps {
  config: K8sConfig;
  serviceName?: string;
}

export const K8sConfigVisualizer = ({ config, serviceName }: K8sConfigVisualizerProps) => {
  if (!config || Object.keys(config).length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-500 text-sm">No K8s configuration found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-3">
        <h3 className="font-semibold text-lg">
          {serviceName ? `${serviceName} - K8s Configuration` : 'Kubernetes Configuration'}
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Memory */}
        {config.memory && (
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <label className="font-semibold text-gray-700">Memory Limit</label>
            </div>
            <p className="text-2xl font-bold text-blue-600">{config.memory}</p>
          </div>
        )}

        {/* CPU */}
        {config.cpu && (
          <div className="border border-green-100 rounded-lg p-4 bg-green-50">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <label className="font-semibold text-gray-700">CPU Limit</label>
            </div>
            <p className="text-2xl font-bold text-green-600">{config.cpu}</p>
          </div>
        )}

        {/* Replicas */}
        {config.replicas !== undefined && (
          <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <label className="font-semibold text-gray-700">Replicas</label>
            </div>
            <p className="text-2xl font-bold text-purple-600">{config.replicas}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default K8sConfigVisualizer;
