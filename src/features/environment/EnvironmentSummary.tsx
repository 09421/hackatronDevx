'use client';

interface EnvironmentSummaryProps {
  spec?: Record<string, any>;
}

export const EnvironmentSummary = ({ spec = {} }: EnvironmentSummaryProps) => {
  const deploymentConfig = spec.deployment_config || {};

  // Get cluster targets from config, fall back to common environments
  const clusterTargets = deploymentConfig.cluster_targets || ['dev', 'test', 'prod'];

  const envDisplayNames: Record<string, string> = {
    'dev-sdc01': 'Dev (SDC01)',
    'test-sdc01': 'Test (SDC01)',
    'prod-sdc01': 'Prod (SDC01)',
    'prod-eus01': 'Prod (EUS01)',
    dev: 'Development',
    test: 'Testing',
    prod: 'Production',
  };

  const getEnvColor = (env: string) => {
    if (env.startsWith('dev')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
    } else if (env.startsWith('test')) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    } else if (env.startsWith('prod')) {
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
    }
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  };

  // Helper function to get nested value with fallback logic
  // path: array of keys to traverse (e.g., ['limit', 'memory'])
  // Prod environments: specific env -> prod-base -> prod -> default
  // Dev/test environments: specific env -> qa-base -> default
  const getNestedValue = (obj: any, env: string, path: string[]): any => {
    if (!obj) return null;
    
    // Build list of keys to check in order
    const keysToCheck: string[] = [env];
    
    if (env.startsWith('prod')) {
      keysToCheck.push('prod-base', 'prod');
    } else {
      keysToCheck.push('qa-base');
    }
    keysToCheck.push('default');
    
    // Try each key in order until we find the value
    for (const key of keysToCheck) {
      let current = obj[key];
      if (current === undefined) continue;
      
      // Traverse the path
      for (const pathKey of path) {
        current = current?.[pathKey];
        if (current === undefined) break;
      }
      
      // If we found a value, return it
      if (current !== undefined) return current;
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {(clusterTargets as string[]).map((env: string) => {
          const colors = getEnvColor(env);
          const displayName = envDisplayNames[env] || env;

          // Gather stats for this environment
          // Get replica counts with independent fallback for each field
          const minReplicas = getNestedValue(deploymentConfig.replicas, env, ['min']);
          const maxReplicas = getNestedValue(deploymentConfig.replicas, env, ['max']);
          
          // Get memory with independent fallback for each field
          const memory = getNestedValue(deploymentConfig.resources, env, ['limit', 'memory']);
          const request = getNestedValue(deploymentConfig.resources, env, ['request', 'memory']);
          const databases = Object.keys(deploymentConfig.database || {}).length;

          return (
            <div
              key={env}
              className={`border-2 rounded-lg overflow-hidden shadow-sm ${colors.bg} ${colors.border}`}
            >
              <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
                <h3 className={`font-bold text-lg ${colors.text}`}>{displayName}</h3>
                <p className={`text-xs ${colors.text} opacity-75`}>{env}</p>
              </div>

              <div className="p-4 space-y-3">
                {minReplicas !== undefined && minReplicas !== null && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Min Replicas</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{minReplicas}</p>
                  </div>
                )}

                {maxReplicas !== undefined && maxReplicas !== null && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Max Replicas</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{maxReplicas}</p>
                  </div>
                )}

                {memory && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Memory Limit</p>
                    <p className="text-sm font-mono text-gray-800">{memory}</p>
                  </div>
                )}

                {request && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Memory Request</p>
                    <p className="text-sm font-mono text-gray-800">{request}</p>
                  </div>
                )}

                {databases > 0 && (
                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-600 font-medium mb-2">Databases</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(deploymentConfig.database || {}).map((db) => (
                        <span
                          key={db}
                          className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded border border-gray-300"
                        >
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <p className="text-sm font-medium text-gray-600 mb-3">Cluster Targets</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {clusterTargets.map((env: string) => {
            const colors = getEnvColor(env);
            return (
              <div key={env} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colors.bg} border ${colors.border}`}></div>
                <span className="text-sm text-gray-700">{envDisplayNames[env] || env}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSummary;
