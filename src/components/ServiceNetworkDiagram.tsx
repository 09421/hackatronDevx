'use client';

import { useMemo } from 'react';

interface Node {
  id: string;
  label: string;
  type: 'service' | 'database' | 'topic' | 'external' | 'search';
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  type: 'produces' | 'consumes' | 'uses' | 'reads' | 'writes';
}

interface ServiceNetworkDiagramProps {
  metadata?: Record<string, any>;
  spec?: Record<string, any>;
  onNodeClick?: (id: string, label: string, type: string) => void;
}

export const ServiceNetworkDiagram = ({
  metadata = {},
  spec = {},
  onNodeClick,
}: ServiceNetworkDiagramProps) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central service node
    const serviceName = metadata.name || 'Service';
    nodes.push({
      id: 'service',
      label: serviceName,
      type: 'service',
      x: 400,
      y: 300,
    });

    const deploymentConfig = spec.deployment_config || {};
    const messageQueue = spec.message_queue || {};
    const database = spec.database || {};
    const searchIndex = spec.search_index || {};
    const serviceDeps = spec.service_dependencies || [];

    // Collect all nodes and positions
    const allItems: Array<{ id: string; label: string; type: string; angle: number; radius: number }> = [];

    // Add service dependency nodes
    serviceDeps.forEach((dep: any) => {
      allItems.push({ id: `svc-${dep.name}`, label: dep.name, type: 'service-dep', angle: 0, radius: 200 });
    });

    // Add database nodes
    Object.keys(database).forEach((dbName) => {
      allItems.push({ id: `db-${dbName}`, label: dbName, type: 'database', angle: 0, radius: 150 });
    });

    // Add Kafka topic nodes (topics we produce to)
    const topicsProduced = Object.keys(messageQueue.topic_definitions || {});
    topicsProduced.forEach((topicName) => {
      allItems.push({ id: `topic-${topicName}`, label: topicName, type: 'topic', angle: 0, radius: 180 });
    });

    // Add external topic access nodes (topics we consume from)
    const externalTopics = Object.keys(messageQueue.external_topic_access || {});
    externalTopics.forEach((topicName) => {
      allItems.push({ id: `external-${topicName}`, label: topicName, type: 'external', angle: 0, radius: 180 });
    });

    // Add search index nodes
    Object.keys(searchIndex).forEach((indexName) => {
      allItems.push({ id: `search-${indexName}`, label: indexName, type: 'search', angle: 0, radius: 150 });
    });

    // Distribute items evenly in a circle
    const totalItems = allItems.length;
    if (totalItems > 0) {
      const angleStep = (2 * Math.PI) / totalItems;
      allItems.forEach((item, idx) => {
        const angle = idx * angleStep;
        const x = 400 + item.radius * Math.cos(angle);
        const y = 300 + item.radius * Math.sin(angle);

        nodes.push({
          id: item.id,
          label: item.label,
          type: item.type as any,
          x,
          y,
        });
      });
    }

    // Create edges
    // Service dependency connections
    serviceDeps.forEach((dep: any) => {
      edges.push({
        from: 'service',
        to: `svc-${dep.name}`,
        type: 'uses',
      });
    });

    // Database connections
    Object.keys(database).forEach((dbName) => {
      edges.push({
        from: 'service',
        to: `db-${dbName}`,
        type: 'uses',
      });
    });

    // Kafka topic connections (produced)
    topicsProduced.forEach((topicName) => {
      edges.push({
        from: 'service',
        to: `topic-${topicName}`,
        type: 'produces',
      });
    });

    // External topic connections
    externalTopics.forEach((topicName) => {
      const accessType = messageQueue.external_topic_access[topicName];
      edges.push({
        from: accessType === 'read' ? `external-${topicName}` : 'service',
        to: accessType === 'read' ? 'service' : `external-${topicName}`,
        type: accessType === 'read' ? 'reads' : 'writes',
      });
    });

    // Search index connections
    Object.keys(searchIndex).forEach((indexName) => {
      edges.push({
        from: 'service',
        to: `search-${indexName}`,
        type: 'writes',
      });
    });

    return { nodes, edges };
  }, [metadata, spec]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'service':
        return { fill: '#3b82f6', text: '#ffffff', hover: '#2563eb' };
      case 'service-dep':
        return { fill: '#06b6d4', text: '#ffffff', hover: '#0891b2' };
      case 'database':
        return { fill: '#8b5cf6', text: '#ffffff', hover: '#7c3aed' };
      case 'topic':
        return { fill: '#10b981', text: '#ffffff', hover: '#059669' };
      case 'external':
        return { fill: '#f59e0b', text: '#ffffff', hover: '#d97706' };
      case 'search':
        return { fill: '#ec4899', text: '#ffffff', hover: '#db2777' };
      default:
        return { fill: '#6b7280', text: '#ffffff', hover: '#4b5563' };
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'produces':
        return '#10b981';
      case 'consumes':
        return '#f59e0b';
      case 'reads':
        return '#f59e0b';
      case 'writes':
        return '#ec4899';
      case 'uses':
        return '#8b5cf6';
      default:
        return '#9ca3af';
    }
  };

  const getEdgeLabel = (type: string) => {
    switch (type) {
      case 'produces':
        return 'produces';
      case 'consumes':
        return 'consumes';
      case 'reads':
        return 'reads';
      case 'writes':
        return 'writes';
      case 'uses':
        return 'uses';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Service Network Diagram</h3>
        <p className="text-indigo-100 text-sm mt-1">Dependencies and connections</p>
      </div>

      <div className="p-6 flex justify-center bg-gray-50">
        <svg width="100%" height="700" viewBox="0 0 800 600" className="max-w-4xl">
          {/* Draw edges (lines with arrows) */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            // Calculate angle for arrow rotation
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);

            return (
              <g key={`edge-${idx}`}>
                {/* Edge line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={getEdgeColor(edge.type)}
                  strokeWidth="2"
                  markerEnd={`url(#arrowhead-${edge.type})`}
                  opacity="0.6"
                />

                {/* Edge label */}
                <text
                  x={midX}
                  y={midY - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#666"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {getEdgeLabel(edge.type)}
                </text>
              </g>
            );
          })}

          {/* Arrow markers */}
          <defs>
            {['produces', 'consumes', 'reads', 'writes', 'uses'].map((type) => (
              <marker
                key={`marker-${type}`}
                id={`arrowhead-${type}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill={getEdgeColor(type)} />
              </marker>
            ))}
          </defs>

          {/* Draw nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node.type);
            const isService = node.type === 'service';
            const radius = isService ? 50 : 40;
            
            // Split label into words and break into lines that fit in circle
            const words = node.label.split('-');
            const maxCharsPerLine = isService ? 10 : 8;
            const lines: string[] = [];
            let currentLine = '';
            
            for (const word of words) {
              if ((currentLine + word).length > maxCharsPerLine && currentLine) {
                lines.push(currentLine.trim());
                currentLine = word;
              } else {
                currentLine += (currentLine ? '-' : '') + word;
              }
            }
            if (currentLine) lines.push(currentLine.trim());

            return (
              <g key={node.id}>
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={colors.fill}
                  className="transition-all hover:cursor-pointer hover:opacity-80"
                  onClick={() => onNodeClick?.(node.id, node.label, node.type)}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
                
                {/* Tooltip on hover */}
                <title>{node.label}</title>

                {/* Multi-line node label */}
                {lines.length > 0 && (
                  <>
                    {lines.map((line, idx) => {
                      const lineCount = lines.length;
                      const yOffset = ((idx - (lineCount - 1) / 2) * (isService ? 11 : 9));
                      return (
                        <text
                          key={`${node.id}-line-${idx}`}
                          x={node.x}
                          y={node.y + yOffset - 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={colors.text}
                          fontSize={isService ? '10' : '8'}
                          fontWeight={isService ? 'bold' : '600'}
                          className="pointer-events-none select-none"
                        >
                          {line}
                        </text>
                      );
                    })}
                  </>
                )}

                {/* Node type label */}
                <text
                  x={node.x}
                  y={node.y + (lines.length > 1 ? 22 : 18)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  fontSize="7"
                  opacity="0.6"
                  className="pointer-events-none select-none"
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { type: 'service', label: 'Service', color: getNodeColor('service').fill },
            { type: 'service-dep', label: 'Dependency', color: getNodeColor('service-dep').fill },
            { type: 'database', label: 'Database', color: getNodeColor('database').fill },
            { type: 'topic', label: 'Topic (Produced)', color: getNodeColor('topic').fill },
            { type: 'external', label: 'External Topic', color: getNodeColor('external').fill },
            { type: 'search', label: 'Search Index', color: getNodeColor('search').fill },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-xs text-gray-700">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { type: 'produces', color: '#10b981' },
            { type: 'reads', color: '#f59e0b' },
            { type: 'writes', color: '#ec4899' },
            { type: 'uses', color: '#8b5cf6' },
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-1 h-4" style={{ backgroundColor: color }}></div>
              <span className="text-xs text-gray-700 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceNetworkDiagram;
