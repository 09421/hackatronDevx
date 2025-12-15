'use client';

import { useState, useEffect, useRef } from 'react';
import EnvironmentSummary from '@/components/EnvironmentSummary';
import ServiceNetworkDiagram from '@/components/ServiceNetworkDiagram';

interface SpecTabProps {
  spec?: Record<string, any>;
  metadata?: Record<string, any>;
  onNodeClick?: (id: string, label: string, type: string) => void;
  initialView?: 'overview' | 'diagram' | 'raw';
  onInitialViewConsumed?: () => void;
  specTabForceDiagram?: number;
}

type ViewMode = 'overview' | 'diagram' | 'raw';

export const SpecTab = ({ spec = {}, metadata = {}, onNodeClick, initialView, onInitialViewConsumed, specTabForceDiagram }: SpecTabProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  useEffect(() => {
    if (initialView) {
      setViewMode(initialView as ViewMode);
      // notify parent that we've consumed the initial view so it can reset
      // use setTimeout to ensure React has applied the state first
      setTimeout(() => {
        onInitialViewConsumed?.();
      }, 0);
    }
  }, [initialView]);

  // If parent signals a force to show the diagram (counter increments), switch view
  // Only react when the counter actually changes compared to the last seen value.
  const lastForceRef = useRef<number | undefined>(specTabForceDiagram);
  useEffect(() => {
    if (typeof specTabForceDiagram === 'undefined') return;
    if (lastForceRef.current === specTabForceDiagram) return;
    // update last seen before acting
    lastForceRef.current = specTabForceDiagram;
    setViewMode('diagram');
  }, [specTabForceDiagram]);
  const [editedSpec] = useState(spec);

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-1 px-6 py-3 font-medium text-center transition-all whitespace-nowrap ${
              viewMode === 'overview'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg mr-2">📊</span>
            Overview
          </button>
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex-1 px-6 py-3 font-medium text-center transition-all whitespace-nowrap ${
              viewMode === 'diagram'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg mr-2">🔗</span>
            Diagram
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`flex-1 px-6 py-3 font-medium text-center transition-all whitespace-nowrap ${
              viewMode === 'raw'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg mr-2">📝</span>
            Raw
          </button>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && <EnvironmentSummary spec={editedSpec} />}

          {viewMode === 'diagram' && (
            <ServiceNetworkDiagram metadata={metadata} spec={editedSpec} onNodeClick={onNodeClick} />
          )}

          {viewMode === 'raw' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Copy this YAML to use in your configuration files:
              </p>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-gray-100 p-4 overflow-x-auto text-sm">
                  {JSON.stringify(editedSpec, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(editedSpec, null, 2));
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h3 className="text-lg font-bold text-white">📊 Configuration Stats</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium">Top Level Keys</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {Object.keys(editedSpec).length}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium">Cluster Config Keys</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {editedSpec.cluster_config ? Object.keys(editedSpec.cluster_config).length : 0}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium">Database Instances</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {editedSpec.database ? Object.keys(editedSpec.database).length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecTab;
