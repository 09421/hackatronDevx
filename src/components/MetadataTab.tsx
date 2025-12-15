'use client';

interface MetadataTabProps {
  metadata?: Record<string, any>;
}

export const MetadataTab = ({ metadata = {} }: MetadataTabProps) => {
  const isEmpty = Object.keys(metadata).length === 0;

  const renderValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getValueType = (value: any): string => {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    if (typeof value === 'object') return 'object';
    return typeof value;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      string: 'bg-blue-50 border-blue-200 text-blue-700',
      number: 'bg-green-50 border-green-200 text-green-700',
      boolean: 'bg-purple-50 border-purple-200 text-purple-700',
      array: 'bg-orange-50 border-orange-200 text-orange-700',
      object: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      null: 'bg-gray-50 border-gray-200 text-gray-700',
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {isEmpty ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No metadata configured</p>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">
              Metadata ({Object.keys(metadata).length} items)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(metadata).map(([key, value]) => {
                const type = getValueType(value);
                const typeColor = getTypeColor(type);

                return (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-gray-800">
                          {key}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded border ${typeColor}`}
                        >
                          {type}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <pre className="font-mono text-sm text-gray-700 overflow-x-auto bg-gray-100 p-3 rounded border border-gray-300 max-h-48 overflow-y-auto">
                        {renderValue(value)}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metadata Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 font-medium">Type Distribution</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                  { type: 'string', color: 'bg-blue-50 border-blue-200' },
                  { type: 'number', color: 'bg-green-50 border-green-200' },
                  { type: 'boolean', color: 'bg-purple-50 border-purple-200' },
                  { type: 'array', color: 'bg-orange-50 border-orange-200' },
                  { type: 'object', color: 'bg-indigo-50 border-indigo-200' },
                ].map(({ type, color }) => {
                  const count = Object.values(metadata).filter(
                    (v) => getValueType(v) === type
                  ).length;
                  return count > 0 ? (
                    <div
                      key={type}
                      className={`border rounded-lg p-3 text-center ${color}`}
                    >
                      <p className="text-gray-600 text-xs font-medium capitalize">
                        {type}
                      </p>
                      <p className="text-xl font-bold text-gray-800 mt-1">
                        {count}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataTab;
