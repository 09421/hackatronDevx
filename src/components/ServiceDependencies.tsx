'use client';

import { ServiceConfig } from '@/lib/yamlParser';

interface ServiceDependenciesProps {
  service: ServiceConfig;
}

interface Dependency {
  name: string;
  icon: string;
  color: string;
  status: boolean | undefined;
}

export const ServiceDependencies = ({ service }: ServiceDependenciesProps) => {
  const dependencies: Dependency[] = [
    { name: 'Database', icon: '🗄️', color: 'blue', status: service.database },
    { name: 'Kafka', icon: '📨', color: 'orange', status: service.kafka },
    { name: 'Redis', icon: '⚡', color: 'red', status: service.redis },
  ];

  const activeDependencies = dependencies.filter((dep) => dep.status === true);
  const inactiveDependencies = dependencies.filter((dep) => dep.status === false || dep.status === undefined);

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-indigo-600 text-white px-6 py-3">
        <h3 className="font-semibold text-lg">
          {service.name ? `${service.name} - Dependencies` : 'Service Dependencies'}
        </h3>
      </div>
      <div className="p-6">
        {activeDependencies.length > 0 ? (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Active Dependencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeDependencies.map((dep) => (
                <div
                  key={dep.name}
                  className={`p-4 rounded-lg border-2 border-green-300 bg-green-50 flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{dep.icon}</span>
                    <span className="font-medium text-gray-800">{dep.name}</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {inactiveDependencies.length > 0 && activeDependencies.length > 0 ? (
          <div>
            <h4 className="font-semibold text-gray-500 mb-3 text-sm uppercase tracking-wide">
              Not Used
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {inactiveDependencies.map((dep) => (
                <div
                  key={dep.name}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between opacity-60"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{dep.icon}</span>
                    <span className="font-medium text-gray-600">{dep.name}</span>
                  </div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        ) : inactiveDependencies.length > 0 && activeDependencies.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No external dependencies configured</p>
        ) : null}
      </div>
    </div>
  );
};

export default ServiceDependencies;
