# YAML Configuration Visualizer

A modern web application built with Next.js, React, and TypeScript to visualize, compare, and edit Kubernetes and multi-environment configurations from YAML files. Perfect for managing complex cluster setups across development, testing, and production environments.

## ✨ Features

### 📊 **Environment Overview**
- Quick visual summary of all environments (Development, Testing, Production, Default)
- Color-coded environment cards with key metrics
- Display of min/max replicas, memory limits, and database configurations per environment

### 🔄 **Environment Comparison**
- Side-by-side comparison of configuration values across environments
- Expandable/collapsible sections for Resources, Replicas, and Database configs
- Easy identification of differences between environments
- Color-coded cards for quick visual scanning

### ✏️ **Configuration Editor**
- Inline editing of YAML values
- Type-aware inputs (strings, numbers, booleans)
- Nested object navigation with expand/collapse
- Save and cancel functionality for safe editing

### 📁 **File Upload**
- Upload YAML files directly from your machine
- Support for drag-and-drop
- GitLab integration to fetch YAML directly from repositories

### 🎨 **Multiple Visualization Modes**
- **Overview**: Quick environment summary with key stats
- **Compare**: Detailed side-by-side environment comparison
- **Edit**: Interactive configuration editor
- **Raw**: JSON view with copy-to-clipboard functionality

### 📋 **Metadata & Environment Variables**
- Dedicated tabs for metadata and environment configuration
- Pretty-formatted display of all configuration values
- Type indicators and statistics

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── components/
│   ├── YamlUploader.tsx         # File upload & GitLab integration
│   ├── EnvironmentComparison.tsx # Environment comparison view
│   ├── EnvironmentSummary.tsx    # Quick environment overview
│   ├── ConfigEditor.tsx         # Configuration editor
│   ├── SpecTab.tsx              # Main specification tab
│   ├── TreeView.tsx             # Generic tree visualization
│   ├── ServicesTab.tsx          # Services display
│   ├── EnvironmentTab.tsx       # Environment variables display
│   ├── MetadataTab.tsx          # Metadata display
│   └── ServiceDependencies.tsx  # Service dependencies
├── lib/
│   └── yamlParser.ts        # YAML parsing utilities
└── public/
    └── example-config.yaml  # Example configuration
```

## YAML File Format

Your YAML files should follow this structure for full feature support:

```yaml
metadata:
  name: your-service-name
  owner: team-name

spec:
  cluster_config:
    resources:
      memory:
        default:
          request: 100Mi
          limit: 400Mi
        prod:
          request: 200Mi
          limit: 800Mi
      cpu:
        default:
          request: 100m
          limit: 500m
        prod:
          request: 200m
          limit: 1000m
    
    replicas:
      min:
        default: 1
        prod: 3
      max:
        default: 5
        prod: 10
  
  application_config:
    version: "1.0.0"
    description: "Your application"
  
  message_queue:
    provider: kafka
    topic_definitions:
      your-topic:
        partitions: 3
        replicas: 2
        retentionDays: 7
  
  search_index:
    provider: elasticsearch
    version: "8.0"
  
  database:
    your-database:
      storageClass:
        default: standard
        prod: premium
      storage:
        default: 100Mi
        prod: 1Ti

  service_dependencies:
    egress:
      - external-service
```

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

### Upload a YAML File

1. Click the **Upload File** button in the uploader
2. Click the file area or drag and drop a YAML file
3. The configuration will be parsed and visualized automatically

### Load from GitLab

1. Click the **Load from GitLab** button
2. Enter the GitLab repository URL (e.g., `https://gitlab.com/group/project`)
3. Provide the file path in the repository (e.g., `config.yaml`)
4. Optionally add a GitLab personal token for private repositories
5. Click **Load from GitLab**

### View Environment Overview

1. Upload or load a YAML file
2. The **Specification** tab will open automatically
3. Select the **Overview** view
4. See a quick summary of all environments with key metrics

### Compare Environments

1. Go to the **Specification** tab
2. Click **Compare Environments**
3. Expand sections to see side-by-side comparisons of:
   - Memory and CPU limits/requests
   - Replica configurations
   - Database storage and storage classes

### Edit Configuration

1. Go to the **Specification** tab
2. Click **Edit**
3. Click the **Edit** button in the Configuration Editor
4. Make your changes
5. Click **Save** to apply or **Cancel** to discard

### Export Configuration

1. Go to the **Specification** tab
2. Click **Raw**
3. View the JSON representation
4. Use **Copy to Clipboard** to copy the entire configuration

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **js-yaml** - YAML parsing

## Features by Environment Type

The visualizer automatically detects and displays configurations for these environments:

- **default** - Default/fallback configuration (Gray)
- **dev** - Development environment (Blue)
- **test** - Testing environment (Yellow)
- **prod** - Production environment (Red)

Each environment is color-coded throughout the application for easy identification.

## Key Components

### EnvironmentComparison
Displays resources, replicas, and database configurations with expandable sections for each category.

### EnvironmentSummary
Quick overview cards showing key metrics for each detected environment.

### ConfigEditor
Interactive editor for modifying configuration values with type-aware inputs and nested navigation.

### SpecTab
Main specification tab providing multiple visualization modes (Overview, Comparison, Edit, Raw).

### TreeView
Generic component for displaying deeply nested YAML structures with expand/collapse functionality.

## Tips & Tricks

- **Quick Comparison**: Use the Overview tab to quickly identify differences between environments
- **Batch Edits**: Use the Editor to make multiple changes at once
- **Backup**: Always export your configuration before making changes
- **Copy Values**: Use the Raw view to copy JSON configuration

## Future Enhancements

- [ ] Direct editing and download of YAML files
- [ ] Configuration history and version control
- [ ] Export as YAML (not just JSON)
- [ ] Configuration validation against schemas
- [ ] Kubernetes API integration for live syncing
- [ ] Diff view comparing two configurations
- [ ] Template management for common configurations
- [ ] Environment variable substitution
- [ ] Dark mode support

## License

MIT

## Support

For issues or suggestions, please open an issue on the project repository.
