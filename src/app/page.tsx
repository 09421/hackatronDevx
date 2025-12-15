'use client';

import { useState, useEffect } from 'react';
import YamlUploader from '@/components/YamlUploader';
import ServicesTab from '@/components/ServicesTab';
import EnvironmentTab from '@/components/EnvironmentTab';
import SpecTab from '@/components/SpecTab';
import LandingPage from '@/components/LandingPage';
import { ParsedYaml, parseYamlContent } from '@/lib/yamlParser';

type TabType = 'services' | 'environment' | 'spec';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'spec', label: 'Specification', icon: '🔧' },
  { id: 'services', label: 'Services', icon: '🚀' },
  { id: 'environment', label: 'Environment', icon: '⚙️' },
];

export default function Home() {
  const [yamlData, setYamlData] = useState<ParsedYaml | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedServiceYaml, setSelectedServiceYaml] = useState<ParsedYaml | null>(null);
  const [isLoadingSelectedService, setIsLoadingSelectedService] = useState(false);
  const [specTabInitialView, setSpecTabInitialView] = useState<'overview' | 'diagram' | 'raw' | null>(null);
  const [specTabForceDiagram, setSpecTabForceDiagram] = useState(0);

  const handleYamlLoaded = (data: ParsedYaml) => {
    setIsLoading(true);
    setTimeout(() => {
      setYamlData(data);
      setIsLoading(false);
      
      // Determine which tab to show first
      if (data.spec && Object.keys(data.spec).length > 0) {
        setActiveTab('spec');
      } else if (data.services && data.services.length > 0) {
        setActiveTab('services');
      } else {
        setActiveTab('environment');
      }
    }, 500);
  };

  // Load default example-config.yaml from `public/` on first render
  useEffect(() => {
    const loadDefault = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/example-config.yaml');
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const txt = await res.text();
        const parsed = parseYamlContent(txt);
        handleYamlLoaded(parsed);
      } catch (e) {
        console.error('Failed loading default example-config.yaml', e);
        setIsLoading(false);
      }
    };

    loadDefault();
  }, []);

  useEffect(() => {
    if (!selectedService) {
      setSelectedServiceYaml(null);
      return;
    }

    let cancelled = false;

    const tryLoad = async () => {
      setIsLoadingSelectedService(true);

      // Candidate filenames to try (in public/ served at /)
      const svc = selectedService;
      const candidates = [
        `example-config-${svc}.yaml`,
        `example-config-${svc}.yml`,
        `example-config-${svc.split('-')[0]}.yaml`,
        `example-config-${svc.split('-')[0]}.yml`,
        `example-config-${svc.replace(/[^a-z0-9-]/gi, '')}.yaml`,
        `example-config-${svc.replace(/[^a-z0-9-]/gi, '')}.yml`,
      ];

      for (const name of candidates) {
        try {
          const res = await fetch(`/${name}`);
          if (!res.ok) continue;
          const txt = await res.text();
          const parsed = parseYamlContent(txt);
          if (cancelled) return;
          setSelectedServiceYaml(parsed);
          setIsLoadingSelectedService(false);
          return;
        } catch (e) {
          // ignore and try next
        }
      }

      if (!cancelled) {
        setSelectedServiceYaml(null);
        setIsLoadingSelectedService(false);
      }
    };

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [selectedService]);

  // Use selected service YAML when available, otherwise fall back to the main uploaded YAML
  const detailYaml = selectedServiceYaml || yamlData;
  const pageOwner = detailYaml?.metadata?.owner || detailYaml?.metadata?.OWNER || detailYaml?.metadata?.Owner || null;

  const hasTab = (tabId: TabType): boolean => {
    if (!yamlData) return false;
    switch (tabId) {
      case 'services':
        return !!(yamlData.services && yamlData.services.length > 0);
      case 'environment':
        return !!(yamlData.env && Object.keys(yamlData.env).length > 0);
      case 'spec':
        return !!(yamlData.spec && Object.keys(yamlData.spec).length > 0);
      default:
        return false;
    }
  };

  const getTabCount = (tabId: TabType): number => {
    if (!yamlData) return 0;
    switch (tabId) {
      case 'services':
        return yamlData.services?.length || 0;
      case 'environment':
        return Object.keys(yamlData.env || {}).length;
      case 'spec':
        return Object.keys(yamlData.spec || {}).length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen transition-colors bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            {selectedService && (
              <button
                onClick={() => setSelectedService(null)}
                className={`text-sm font-medium mb-2 transition-colors text-blue-600 hover:text-blue-700`}
              >
                ← Back to Services
              </button>
            )}
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {selectedService ? selectedService : 'Kamstage'}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-600">{selectedService ? 'View detailed configuration and status' : ''}</p>
            </div>
          </div>
          
        </div>

        {/* Loading example config by default (uploader hidden) */}

        {/* Content Area */}
        {!selectedService && yamlData && !isLoading && (
          <div className="space-y-6">
            <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
              <div className="p-6 bg-gray-50">
                <LandingPage onServiceSelect={setSelectedService} />
              </div>
            </div>
          </div>
        )}

        {selectedService && yamlData && !isLoading && (
          <div className="space-y-6">
            <div className="rounded-lg border shadow-sm overflow-hidden transition-colors bg-white border-gray-300">
              <div className="flex items-center justify-between border-b border-gray-300">
                <div className="flex flex-wrap">
                  {TABS.map((tab) => {
                    const count = getTabCount(tab.id);
                    const show = hasTab(tab.id);
                    if (!show) return null;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 font-medium text-center transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white border-b-2 border-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        <span className="text-xl mr-2">{tab.icon}</span>
                        {tab.label}
                        {count > 0 && (
                          <span className="ml-2 inline-block bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 pr-6">
                  {pageOwner && (
                    <div className="text-sm font-medium px-3 py-1 rounded bg-gray-100 text-gray-800">
                      👤 {pageOwner}
                    </div>
                  )}
                  {(selectedService || detailYaml?.metadata?.name) && (
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://gitlab.example.com/${selectedService || detailYaml?.metadata?.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:opacity-80"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open GitLab"
                        title="Open GitLab"
                      >
                        <img src="/gitlab-logo-500-rgb.svg" alt="GitLab" className="w-18 h-18 hover:scale-110 transition-transform" />
                      </a>
                      <a
                        href={`https://grafana.example.com/dashboard/${selectedService || detailYaml?.metadata?.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:opacity-80"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open Grafana"
                        title="Open Grafana"
                      >
                        <img src="/Grafana_logo.svg" alt="Grafana" className="w-10 h-10 hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                {isLoadingSelectedService && (
                  <div className="text-center py-12">Loading selected service configuration…</div>
                )}

                {!isLoadingSelectedService && (
                  <>
                    {activeTab === 'services' && detailYaml?.services && <ServicesTab services={detailYaml.services} metadata={detailYaml.metadata} spec={detailYaml.spec} />}
                    {activeTab === 'environment' && <EnvironmentTab env={detailYaml?.env} />}
                    {activeTab === 'spec' && detailYaml?.spec && (
                      <SpecTab
                        spec={detailYaml.spec}
                        metadata={detailYaml.metadata}
                        initialView={specTabInitialView || undefined}
                        onInitialViewConsumed={() => setSpecTabInitialView(null)}
                        specTabForceDiagram={specTabForceDiagram}
                        onNodeClick={(id, label, type) => {
                          if (type === 'service-dep' || type === 'service') {
                            // open the clicked service and show its diagram
                            setSelectedService(label);
                            setActiveTab('spec');
                            setSpecTabInitialView('diagram');
                            setSpecTabForceDiagram((s) => s + 1);
                          }
                        }}
                      />
                    )}
                    
                  </>
                )}
              </div>
            </div>

            {yamlData.services && yamlData.services.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">📊 Configuration Summary</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">Total Services</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{yamlData.services.length}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">K8s Configured</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">{yamlData.services.filter((s) => s.k8s).length}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">With Dependencies</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{yamlData.services.filter((s) => s.database || s.kafka || s.redis).length}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-medium">Env Variables</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{yamlData.env ? Object.keys(yamlData.env).length : 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!yamlData && !isLoading && (
          <div className="text-center py-16 bg-white border border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg mb-4">No YAML loaded yet</p>
            <p className="text-gray-400">Upload or import a configuration file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
