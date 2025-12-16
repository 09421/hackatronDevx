'use client';

import { useState } from 'react';

interface EnvironmentComparisonProps {
  clusterConfig?: Record<string, any>;
  applicationConfig?: Record<string, any>;
}

interface EnvironmentData {
  name: string;
  color: string;
  bgColor: string;
  data: Record<string, any>;
}

export const EnvironmentComparison = ({
  clusterConfig = {},
  applicationConfig = {},
}: EnvironmentComparisonProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    resources: true,
    replicas: true,
  });

  // Always show dev, test, prod
  const environments = ['dev', 'test', 'prod'];

  const getEnvValue = (path: string[], env: string): any => {
    let current = clusterConfig;
    for (const key of path) {
      current = current?.[key];
      if (!current) return null;
    }
    
    // Try to get value for specific environment, fall back to 'default'
    const envValue = current?.[env];
    if (envValue !== undefined) return envValue;
    return current?.['default'];
  };

  const environmentColors: Record<string, EnvironmentData> = {
    dev: {
      name: 'Development',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100 border-blue-300',
      data: {},
    },
    test: {
      name: 'Testing',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100 border-yellow-300',
      data: {},
    },
    prod: {
      name: 'Production',
      color: 'text-green-700',
      bgColor: 'bg-green-100 border-green-300',
      data: {},
    },
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderValue = (value: any): string => {
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const renderResourcesComparison = () => {
    if (!clusterConfig.resources) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div
          onClick={() => toggleSection('resources')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 flex items-center justify-between"
        >
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className={`mr-3 transition-transform ${expandedSections.resources ? '' : '-rotate-90'}`}>
              ▼
            </span>
            Resources Configuration
          </h3>
        </div>

        {expandedSections.resources && (
          <div className="p-6 space-y-6">
            {/* Memory Comparison - New structure: resources.{env}.limit.memory */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Memory Limit</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {environments.map((env) => {
                  const resourceConfig = clusterConfig.resources?.[env];
                  const defaultConfig = clusterConfig.resources?.default;
                  const memory = resourceConfig?.limit?.memory || defaultConfig?.limit?.memory;
                  const request = resourceConfig?.request?.memory || defaultConfig?.request?.memory;
                  if (!memory && !request) return null;
                  const envData = environmentColors[env];
                  return (
                    <div
                      key={env}
                      className={`border-2 rounded-lg p-4 ${envData.bgColor}`}
                    >
                      <p className={`font-semibold text-sm mb-2 ${envData.color}`}>
                        {envData.name}
                      </p>
                      {request && (
                        <div className="text-sm mb-2">
                          <span className="text-gray-600">Request:</span>
                          <p className="font-mono font-bold text-gray-800">{renderValue(request)}</p>
                        </div>
                      )}
                      {memory && (
                        <div className="text-sm">
                          <span className="text-gray-600">Limit:</span>
                          <p className="font-mono font-bold text-gray-800">{renderValue(memory)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReplicasComparison = () => {
    if (!clusterConfig.replicas) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div
          onClick={() => toggleSection('replicas')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 cursor-pointer hover:from-purple-700 hover:to-purple-800 flex items-center justify-between"
        >
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className={`mr-3 transition-transform ${expandedSections.replicas ? '' : '-rotate-90'}`}>
              ▼
            </span>
            Replicas Configuration
          </h3>
        </div>

        {expandedSections.replicas && (
          <div className="p-6 space-y-6">
            {/* Minimum Replicas */}
            {clusterConfig.replicas.min && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Minimum Replicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {environments.map((env) => {
                    const value = getEnvValue(['replicas', 'min'], env);
                    if (value === undefined) return null;
                    const envData = environmentColors[env];
                    return (
                      <div
                        key={env}
                        className={`border-2 rounded-lg p-4 ${envData.bgColor}`}
                      >
                        <p className={`font-semibold text-sm mb-2 ${envData.color}`}>
                          {envData.name}
                        </p>
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Maximum Replicas */}
            {clusterConfig.replicas.max && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Maximum Replicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {environments.map((env) => {
                    const value = getEnvValue(['replicas', 'max'], env);
                    if (value === undefined) return null;
                    const envData = environmentColors[env];
                    return (
                      <div
                        key={env}
                        className={`border-2 rounded-lg p-4 ${envData.bgColor}`}
                      >
                        <p className={`font-semibold text-sm mb-2 ${envData.color}`}>
                          {envData.name}
                        </p>
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderDatabaseComparison = () => {
    if (!clusterConfig.database) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div
          onClick={() => toggleSection('database')}
          className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 cursor-pointer hover:from-green-700 hover:to-green-800 flex items-center justify-between"
        >
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className={`mr-3 transition-transform ${expandedSections.database ? '' : '-rotate-90'}`}>
              ▼
            </span>
            Database Configuration
          </h3>
        </div>

        {expandedSections.database && (
          <div className="p-6 space-y-6">
            {Object.entries(clusterConfig.database).map(([dbName, dbConfig]: [string, any]) => (
              <div key={dbName} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-800 text-base">{dbName}</h4>

                {dbConfig.storage && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">Storage</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(dbConfig.storage).map(([env, storage]: [string, any]) => {
                        const envData = environmentColors[env] || { name: env, bgColor: 'bg-gray-100 border-gray-300', color: 'text-gray-700' };
                        return (
                          <div
                            key={env}
                            className={`border-2 rounded-lg p-3 ${envData.bgColor}`}
                          >
                            <p className={`font-semibold text-xs mb-2 ${envData.color}`}>
                              {envData.name}
                            </p>
                            <p className="font-mono font-bold text-gray-800">{renderValue(storage)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {dbConfig.storage_class && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">Storage Class</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(dbConfig.storage_class).map(([env, storageClass]: [string, any]) => {
                        const envData = environmentColors[env] || { name: env, bgColor: 'bg-gray-100 border-gray-300', color: 'text-gray-700' };
                        return (
                          <div
                            key={env}
                            className={`border-2 rounded-lg p-3 ${envData.bgColor}`}
                          >
                            <p className={`font-semibold text-xs mb-2 ${envData.color}`}>
                              {envData.name}
                            </p>
                            <p className="font-mono text-sm text-gray-800">{renderValue(storageClass)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Environments Found</h2>
        <div className="flex flex-wrap gap-3">
          {environments.map((env) => {
            const envData = environmentColors[env];
            return (
              <div key={env} className={`border-2 rounded-full px-4 py-2 font-semibold ${envData.bgColor}`}>
                <span className={envData.color}>{envData.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {renderResourcesComparison()}
      {renderReplicasComparison()}
      {renderDatabaseComparison()}
    </div>
  );
};

export default EnvironmentComparison;
