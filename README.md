# YAML Configuration Visualizer

A modern web application built with Next.js, React, and TypeScript to visualize Kubernetes and service configurations from YAML files. Upload YAML files directly or fetch them from GitLab repositories to see detailed visualizations of your K8s setup, resource limits, and service dependencies.

## Features

✨ **YAML File Upload** - Upload YAML configuration files directly from your machine
📦 **GitLab Integration** - Fetch YAML files directly from GitLab repositories
🎨 **Beautiful Visualizations** - Color-coded cards for memory, CPU, replicas, and dependencies
🗄️ **Dependency Tracking** - Visual indicators for database, Kafka, and Redis usage
📊 **Configuration Summary** - Overview statistics of all services
🔍 **Raw JSON View** - View the complete parsed configuration in JSON format

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page with state management
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/
│   ├── YamlUploader.tsx           # File upload & GitLab integration
│   ├── K8sConfigVisualizer.tsx    # K8s resource visualization
│   └── ServiceDependencies.tsx    # Service dependency display
├── lib/
│   └── yamlParser.ts      # YAML parsing utilities
└── public/
    └── example-config.yaml # Example configuration file
```

## YAML File Format

Your YAML files should follow this structure:

```yaml
services:
  - name: api-gateway
    version: "1.0.0"
    k8s:
      memory: "512Mi"
      cpu: "500m"
      replicas: 3
    database: true
    kafka: true
    redis: false

  - name: auth-service
    version: "2.1.0"
    k8s:
      memory: "256Mi"
      cpu: "250m"
      replicas: 2
    database: true
    kafka: false
    redis: true

env:
  LOG_LEVEL: "info"
  ENVIRONMENT: "production"

metadata:
  cluster: "production"
  region: "us-east-1"
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

1. Click the **Upload File** tab on the main page
2. Click the file area or drag and drop a YAML file
3. The configuration will be parsed and visualized automatically

### Fetch from GitLab

1. Click the **Load from GitLab** tab
2. Enter the GitLab repository URL (e.g., `https://gitlab.com/group/project`)
3. Provide the file path in the repository (e.g., `config.yaml`)
4. (Optional) Add a GitLab personal token for private repositories
5. Click **Load from GitLab**

### Example Configuration

A sample configuration file is included at `/public/example-config.yaml`. You can download it and test the uploader.

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **js-yaml** - YAML parsing
- **ESLint** - Code quality

## API Routes

Currently, this is a client-side application. YAML parsing happens entirely in the browser using `js-yaml`. GitLab file fetching uses the GitLab raw file API.

## Key Components

### YamlUploader
Handles both local file uploads and GitLab repository integration with error handling.

### K8sConfigVisualizer
Displays Kubernetes configuration details including memory, CPU limits, and replica counts with color-coded cards.

### ServiceDependencies
Shows which external services (Database, Kafka, Redis) each service uses with visual indicators.

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

