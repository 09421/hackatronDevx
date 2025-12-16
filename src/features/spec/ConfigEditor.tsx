'use client';

import { useState } from 'react';

interface ConfigEditorProps {
  data: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
}

interface EditingState {
  [key: string]: any;
}

export const ConfigEditor = ({ data, onSave }: ConfigEditorProps) => {
  const [editingData, setEditingData] = useState<EditingState>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const togglePath = (path: string) => {
    const newSet = new Set(expandedPaths);
    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    setExpandedPaths(newSet);
  };

  const updateValue = (path: string[], value: any) => {
    const newData = JSON.parse(JSON.stringify(editingData));
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setEditingData(newData);
  };

  const handleSave = () => {
    onSave?.(editingData);
    setIsEditing(false);
  };

  const renderEditor = (value: any, path: string[] = []): React.ReactNode => {
    const pathKey = path.join('.');

    if (typeof value === 'string' || typeof value === 'number') {
      return isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => updateValue(path, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded font-mono text-sm w-full"
        />
      ) : (
        <span className="font-mono text-sm text-gray-800">{value}</span>
      );
    }

    if (typeof value === 'boolean') {
      return isEditing ? (
        <select
          value={String(value)}
          onChange={(e) => updateValue(path, e.target.value === 'true')}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : (
        <span className={`font-semibold text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
          {String(value)}
        </span>
      );
    }

    if (value === null) {
      return <span className="text-gray-400 italic">null</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="ml-4 border-l-2 border-gray-300 pl-4 py-2">
          {value.map((item, idx) => (
            <div key={idx} className="mb-2">
              <span className="text-gray-600 text-sm">[{idx}]:</span>
              <div className="ml-2">{renderEditor(item, [...path, String(idx)])}</div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedPaths.has(pathKey);
      return (
        <div>
          <button
            onClick={() => togglePath(pathKey)}
            className="text-left hover:bg-gray-100 rounded px-2 py-1 text-sm font-medium text-gray-700 mb-2"
          >
            <span className={`mr-1 transition-transform inline-block ${isExpanded ? '' : '-rotate-90'}`}>
              ▼
            </span>
            {Object.keys(value).length} properties
          </button>
          {isExpanded && (
            <div className="ml-4 border-l-2 border-blue-300 pl-4 py-2 space-y-3">
              {Object.entries(value).map(([key, val]) => (
                <div key={key} className="py-2 px-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-800">{key}</span>
                    <span className="text-xs text-gray-500">
                      {typeof val === 'object' ? (Array.isArray(val) ? 'array' : 'object') : typeof val}
                    </span>
                  </div>
                  <div>{renderEditor(val, [...path, key])}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-500">Unknown type</span>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Configuration Editor</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded font-medium text-sm hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingData(data);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded font-medium text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded font-medium text-sm hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        {Object.keys(editingData).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No configuration data</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(editingData).map(([key, value]) => (
              <div key={key} className="py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono font-semibold text-gray-800">{key}</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {typeof value === 'object' ? (Array.isArray(value) ? 'array' : 'object') : typeof value}
                  </span>
                </div>
                <div className="text-sm">{renderEditor(value, [key])}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigEditor;
