'use client';

import { useState, useEffect, useRef } from 'react';
import YAML from 'js-yaml';
import EnvironmentSummary from '../environment/EnvironmentSummary';
import ServiceNetworkDiagram from '../services/ServiceNetworkDiagram';
// Metadata moved to header; no separate metadata panel needed here

interface SpecTabProps {
  spec?: Record<string, any>;
  metadata?: Record<string, any>;
  onNodeClick?: (id: string, label: string, type: string) => void;
  onSave?: (spec: Record<string, any>) => void;
  initialView?: 'overview' | 'diagram' | 'env' | 'raw';
  onInitialViewConsumed?: () => void;
  specTabForceDiagram?: number;
}

type ViewMode = 'overview' | 'diagram' | 'env' | 'raw';

export const SpecTab = ({ spec = {}, metadata = {}, onNodeClick, onSave, initialView, onInitialViewConsumed, specTabForceDiagram }: SpecTabProps) => {
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
  const [editedSpec, setEditedSpec] = useState<Record<string, any>>(spec);
  const [isEditing, setIsEditing] = useState(false);
  const [rawText, setRawText] = useState(() => YAML.dump(spec, { noRefs: true }));

  useEffect(() => {
    setEditedSpec(spec);
    setRawText(YAML.dump(spec || {}, { noRefs: true }));
  }, [spec]);

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
          <button
            onClick={() => setViewMode('env')}
            className={`flex-1 px-6 py-3 font-medium text-center transition-all whitespace-nowrap ${
              viewMode === 'env'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg mr-2">🧩</span>
            Env
          </button>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && <EnvironmentSummary spec={editedSpec} />}

          {viewMode === 'diagram' && (
            <ServiceNetworkDiagram metadata={metadata} spec={editedSpec} onNodeClick={onNodeClick} />
          )}

          {viewMode === 'raw' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Raw YAML (editable)</p>

              {!isEditing ? (
                <div>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="p-4 max-h-[420px] overflow-y-auto text-sm">
                      <pre className="text-gray-100 font-mono whitespace-pre break-words">
                        {YAML.dump(editedSpec || {}, { noRefs: true })}
                      </pre>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(YAML.dump(editedSpec || {}, { noRefs: true }));
                        alert('Copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full min-h-[420px] max-h-[720px] overflow-y-auto font-mono text-sm p-3 bg-gray-900 text-gray-100 rounded border border-gray-700"
                    spellCheck={false}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                          try {
                            const parsed = YAML.load(rawText) as Record<string, any>;
                            const normalized = parsed || {};
                            setEditedSpec(normalized);
                            setIsEditing(false);
                            setRawText(YAML.dump(normalized, { noRefs: true }));
                            onSave?.(normalized);
                          } catch (err: any) {
                            alert('Failed to parse YAML: ' + (err?.message || String(err)));
                            return;
                          }
                        }}
                      className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setRawText(YAML.dump(editedSpec || {}, { noRefs: true }));
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {viewMode === 'env' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Environment variables (merged per environment)</p>

              <EnvVarsViewer metadata={metadata} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {/* Configuration feature presence */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h3 className="text-lg font-bold text-white">📊 Configuration Stats</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(
              [
                { key: 'database', label: 'Database' },
                { key: 'search_index', label: 'Search Index' },
                { key: 'kafka', label: 'Kafka' },
                { key: 'redis', label: 'Redis' }
              ] as Array<{ key: string; label: string }>
            ).map((feat) => {
              const val = (editedSpec as any)[feat.key];
              const present = !!val;
              const count = present ? (Array.isArray(val) ? val.length : typeof val === 'object' ? Object.keys(val).length : 1) : 0;
              return (
                <div
                  key={feat.key}
                  className={`${present ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4`}
                >
                  <p className="text-gray-600 text-sm font-medium">{feat.label}</p>
                  <p className={`${present ? 'text-3xl font-bold text-green-600 mt-2' : 'text-3xl font-bold text-gray-500 mt-2'}`}>
                    {present ? 'Yes' : 'No'}
                  </p>
                  {present && count > 1 && <p className="text-sm text-gray-500 mt-1">{count} entries</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metadata shown in page header; removed inline Metadata panel */}
    </div>
  );
};

export default SpecTab;

function EnvVarsViewer({ metadata }: { metadata?: Record<string, any> }) {
  const serviceName = metadata?.name || metadata?.NAME || metadata?.Name || '';

  const ENV_FILES = [
    { key: 'prod-base', file: '/env_prod_base.yaml', label: 'prod-base' },
    { key: 'prod-sdc01', file: '/env_prod_sdc01.yaml', label: 'prod-sdc01' },
    { key: 'prod-eus01', file: '/env_prod_eus01.yaml', label: 'prod-eus01' },
    { key: 'qa-base', file: '/env_qa_base.yaml', label: 'qa-base' },
    { key: 'test', file: '/env_test.yaml', label: 'test' },
    { key: 'dev', file: '/env_dev.yaml', label: 'dev' },
  ];

  const ENV_CHAIN: Record<string, string[]> = {
    'prod-base': ['prod-base'],
    'prod-sdc01': ['prod-base', 'prod-sdc01'],
    'prod-eus01': ['prod-base', 'prod-eus01'],
    'qa-base': ['qa-base'],
    'test': ['qa-base', 'test'],
    'dev': ['qa-base', 'dev'],
  };

  const [envMaps, setEnvMaps] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(ENV_FILES[0].key);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const res: Record<string, any> = {};
      await Promise.all(
        ENV_FILES.map(async (ef) => {
          try {
            const r = await fetch(ef.file);
            if (!r.ok) return;
            const txt = await r.text();
            // Try parsing YAML first
            try {
              const j = YAML.load(txt) as any;
              // If YAML parsed to an object mapping, use it
              if (j && typeof j === 'object') {
                res[ef.key] = j;
                return;
              }
            } catch (pe) {
              // continue to fallback parsing
            }

            // Fallback: parse simple KEY=VALUE lines where keys are like service__KEY
            const parsed: Record<string, Record<string, string>> = {};
            txt.split(/\r?\n/).forEach((line) => {
              const trimmed = line.trim();
              if (!trimmed) return;
              // ignore JSON-like braces (if present)
              if (trimmed === '{' || trimmed === '}' || trimmed.startsWith('//')) return;
              const idx = trimmed.indexOf('=');
              if (idx === -1) return;
              const left = trimmed.substring(0, idx).trim();
              const value = trimmed.substring(idx + 1).trim();
              const parts = left.split('__');
              if (parts.length < 2) return;
              const svc = parts[0];
              const key = parts.slice(1).join('__');
              if (!parsed[svc]) parsed[svc] = {};
              parsed[svc][key] = value;
            });
            // if we found parsed entries, assign
            if (Object.keys(parsed).length > 0) {
              res[ef.key] = parsed;
            }
          } catch (e) {
            // ignore
          }
        })
      );
      if (!cancelled) {
        setEnvMaps(res);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!serviceName) {
    return <div className="text-sm text-gray-500">No service name available in metadata to lookup envs.</div>;
  }

  if (loading || !envMaps) {
    return <div className="text-sm text-gray-500">Loading environment variables…</div>;
  }

  // Build merged env using chain
  const chain = ENV_CHAIN[selectedEnv] || [selectedEnv];
  const merged = chain.reduce((acc: Record<string, any>, key) => ({ ...acc, ...((envMaps as any)[key]?.[serviceName] || {}) }), {});

  // Determine which keys are overridden (last env in chain that set the key)
  const overrideMap: Record<string, string> = {};
  chain.forEach((key) => {
    const src = (envMaps as any)[key]?.[serviceName] || {};
    Object.keys(src).forEach((k) => {
      overrideMap[k] = key;
    });
  });
  const overriddenKeys = Object.keys(overrideMap).filter((k) => overrideMap[k] !== chain[0]);

  const copyAsEnv = () => {
    const lines = Object.entries(merged).map(([k, v]) => `${k}=${String(v)}`);
    navigator.clipboard.writeText(lines.join('\n'));
    alert('Copied merged env to clipboard');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        {ENV_FILES.map((ef) => (
          <button
            key={ef.key}
            onClick={() => setSelectedEnv(ef.key)}
            className={`px-3 py-1 rounded ${selectedEnv === ef.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {ef.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button onClick={copyAsEnv} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Copy merged</button>
          <button onClick={() => setShowJson((s) => !s)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">{showJson ? 'Hide YAML' : 'Show YAML'}</button>
        </div>
      </div>

      <div className="bg-gray-50 rounded border border-gray-200 p-4">
        {Object.keys(merged).length === 0 ? (
          <div className="text-sm text-gray-500">No environment variables found for {serviceName} in {selectedEnv}.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(merged).map(([k, v]) => (
              <div key={k} className={`${overriddenKeys.includes(k) ? 'bg-yellow-50 border border-yellow-200' : ''} rounded p-2` }>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-gray-700">{k}</div>
                  <div className="text-sm text-gray-600">{String(v)}</div>
                </div>
                {overriddenKeys.includes(k) && (
                  <div className="text-xs text-yellow-700 mt-1">Overridden in {selectedEnv}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showJson && (
          <pre className="mt-4 p-3 bg-gray-900 text-gray-100 rounded text-sm overflow-auto">{YAML.dump(merged)}</pre>
        )}
      </div>
    </div>
  );
}
