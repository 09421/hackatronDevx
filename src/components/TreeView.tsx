'use client';

import { useState } from 'react';

interface TreeViewProps {
  data: Record<string, any>;
  title?: string;
  defaultExpanded?: boolean;
}

interface TreeNodeProps {
  nodeKey: string;
  value: any;
  level: number;
}

const TreeNode = ({ nodeKey, value, level }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isNested = isObject || isArray;

  const getValueDisplay = (val: any): string => {
    if (val === null) return 'null';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'number') return String(val);
    return '';
  };

  const getTypeColor = (val: any): string => {
    if (val === null) return 'text-gray-500';
    if (typeof val === 'boolean') return 'text-purple-600';
    if (typeof val === 'string') return 'text-green-600';
    if (typeof val === 'number') return 'text-blue-600';
    if (Array.isArray(val)) return 'text-orange-600';
    if (typeof val === 'object') return 'text-indigo-600';
    return 'text-gray-600';
  };

  const getValueBg = (val: any): string => {
    if (typeof val === 'string') return 'bg-green-50';
    if (typeof val === 'number') return 'bg-blue-50';
    if (typeof val === 'boolean') return 'bg-purple-50';
    return 'bg-gray-50';
  };

  const leftPadding = `${level * 24}px`;

  return (
    <div>
      <div className="flex items-start py-2 hover:bg-gray-50 rounded px-2 transition-colors">
        <div style={{ minWidth: leftPadding }} />
        <div className="flex-1 flex items-start gap-2">
          {isNested ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 p-0.5 hover:bg-gray-200 rounded cursor-pointer text-gray-600 hover:text-gray-800 flex-shrink-0"
            >
              <span className={`inline-block transition-transform ${isExpanded ? '' : '-rotate-90'}`}>
                ▼
              </span>
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <div className="flex-1 min-w-0">
            <span className="font-mono font-semibold text-gray-800">{nodeKey}</span>
            {!isNested && (
              <>
                <span className="text-gray-500 mx-1">:</span>
                <span className={`font-mono ${getTypeColor(value)} ${getValueBg(value)} px-2 py-0.5 rounded inline-block`}>
                  {getValueDisplay(value)}
                </span>
              </>
            )}
            {isNested && (
              <span className="text-gray-500 ml-1">
                {isArray ? `[${(value as any[]).length}]` : `{}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && isNested && (
        <div>
          {isArray ? (
            (value as any[]).map((item, idx) => (
              <TreeNode key={`${nodeKey}-${idx}`} nodeKey={`[${idx}]`} value={item} level={level + 1} />
            ))
          ) : (
            Object.entries(value).map(([key, val]) => (
              <TreeNode key={`${nodeKey}-${key}`} nodeKey={key} value={val} level={level + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const TreeView = ({ data, title, defaultExpanded = true }: TreeViewProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-indigo-500 rounded p-1 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="p-6 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
          {Object.entries(data).length === 0 ? (
            <p className="text-gray-500 py-4">No data</p>
          ) : (
            Object.entries(data).map(([key, value]) => (
              <TreeNode key={key} nodeKey={key} value={value} level={0} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TreeView;
