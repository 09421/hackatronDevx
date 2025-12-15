'use client';

interface EnvironmentTabProps {
  env?: Record<string, string | number | boolean>;
}

export const EnvironmentTab = ({ env = {} }: EnvironmentTabProps) => {
  const isEmpty = Object.keys(env).length === 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {isEmpty ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No environment variables configured</p>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">
              Environment Variables ({Object.keys(env).length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(env).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm font-semibold text-gray-800">{key}</p>
                    <p className="font-mono text-xs text-gray-500 mt-1">
                      Type: {typeof value}
                    </p>
                  </div>
                  <div className="ml-4 flex-1 text-right">
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 inline-block">
                      <p className="font-mono text-sm text-gray-700 break-words max-w-xs">
                        {String(value)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 font-medium">Statistics</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium">Total Variables</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {Object.keys(env).length}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium">String Values</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {
                      Object.values(env).filter((v) => typeof v === 'string')
                        .length
                    }
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium">Numeric/Boolean</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {
                      Object.values(env).filter(
                        (v) => typeof v !== 'string'
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentTab;
