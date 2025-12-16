# Kamstage - Configuration Visualizer
By team B) @man

A modern web application built with Next.js, React, and TypeScript to visualize service configurations and deployments. Upload YAML files to explore services, environment-specific configurations, deployment specs, and service dependencies through an interactive tabbed interface.

## Features

✨ **Tabbed Interface** - Specification, Services, Environment, Metadata, and Status tabs for comprehensive views
📊 **Service Network Diagram** - Interactive SVG diagrams showing service dependencies and relationships
🔗 **Service Dependency Navigation** - Click diagram nodes to load service details
⚙️ **Environment Configuration** - View merged environment variables per cluster (dev, qa, prod with regional variants)
📋 **Metadata & Status** - Display service metadata and pod/resource status information
🎯 **Landing Page** - Quick overview of services with health status and resource utilization
🌓 **Dark Mode** - Toggle between light and dark themes

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main page with tab management and state
│   ├── layout.tsx                  # App layout
│   └── globals.css                 # Global styles
├── components/
│   ├── SpecTab.tsx                 # Specification view (Overview/Diagram/Raw tabs + Env viewer)
│   ├── ServicesTab.tsx             # Services list and details
│   ├── EnvironmentTab.tsx          # Environment configuration view
│   ├── MetadataTab.tsx             # Metadata display
│   ├── StatusTab.tsx               # Pod and resource status
│   ├── LandingPage.tsx             # Services overview and quick view
│   ├── ServiceNetworkDiagram.tsx   # Interactive SVG dependency diagram
│   ├── EnvironmentSummary.tsx      # Environment tiles with fallback logic
│   └── YamlUploader.tsx            # YAML file upload utility
├── lib/
│   └── yamlParser.ts               # YAML parsing utilities
└── public/
    ├── example-config.yaml         # Main example configuration
    ├── env_dev.yaml                # Dev environment variables
    ├── env_test.yaml               # Test environment variables
    ├── env_qa_base.yaml            # QA base environment variables
    ├── env_prod_base.yaml          # Production base environment variables
    ├── env_prod_eus01.yaml         # Production East US environment variables
    └── env_prod_sdc01.yaml         # Production SDC environment variables
```

## YAML Configuration Format

The main configuration file should include metadata, specification, and service details:

```yaml
metadata:
  name: my-namespace
  owner: team-a

spec:
  deployment_config:
    cluster_targets:
      - prod-eus01
      - prod-sdc01
    resources:
      default:
        limit:
          memory: 1Gi
          cpu: 1000m
        request:
          memory: 512Mi
          cpu: 500m
      prod-base:
        limit:
          memory: 2Gi
    replicas:
      default: 2
      prod-base:
        min: 2
        max: 5
  
  database:
    postgres-main:
      host: db.internal
      port: 5432
  
  kafka:
    topic-events: {}
  
  external_services:
    - name: payment-api
      endpoint: https://api.payment.com

services:
  - name: consumption-metric-processor
    version: "1.0.0"
    database: postgres-main
    kafka:
      - topic-events

  - name: billing-entity-service
    version: "2.1.0"
    database: postgres-main
```

## Environment Variable Files

Environment-specific variables are stored in `public/env_*.yaml` files with the format:

```yaml
service-name__VARIABLE_NAME=value
service-name__DATABASE_HOST=db.prod.internal
service-name__LOG_LEVEL=info
```

Environment fallback hierarchy:
- Specific environment (e.g., `prod-eus01`) → Base environment (e.g., `prod-base`) → Default values

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Start the Application

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)
3. The app automatically loads `public/example-config.yaml` on startup

### Navigate the UI

- **Landing Page**: Shows a quick overview of services with status and resource info
- **Spec Tab**: Displays specification overview, interactive service network diagram, or raw YAML
- **Services Tab**: Lists all services with their configuration
- **Environment Tab**: View environment variables for different deployment targets with fallback merging
- **Metadata Tab**: Display service metadata
- **Status Tab**: Shows pod and resource utilization metrics

### Interactive Features

- Click service cards on the landing page to view detailed configuration
- Click nodes in the service network diagram to navigate to that service
- Environment viewer merges variables from the fallback chain for the selected environment
- Toggle dark/light mode with the theme button in the header

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **js-yaml** - YAML parsing
- **ESLint** - Code quality

## Key Concepts

### Service Network Diagram
A visual SVG-based graph showing:
- **Services** (circles with service names)
- **Dependencies** (databases, Kafka topics, external services, Redis, search indices)
- **Relationships** (edges showing produces, consumes, reads, writes, uses relationships)
- Interactive nodes allow clicking to load service details

### Environment Fallback Logic
Per-field fallback mechanism for resources:
1. Check environment-specific values (e.g., `prod-eus01`)
2. Fall back to base environment (e.g., `prod-base`)
3. Fall back to default values

This applies to memory limits, CPU requests, and replica configurations.

### Client-Side Processing
All YAML parsing and environment merging happens in the browser using `js-yaml`. No server-side processing required.

## Future Enhancements

- Support for multiple file upload
- YAML validation against schemas
- Export configuration as JSON
- Comparison view for multiple configurations
- Real-time editing capabilities
- Integration with Kubernetes API for live cluster monitoring

## License

MIT

## Support

For issues or suggestions, please open an issue on the project repository.

