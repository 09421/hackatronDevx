import YAML from 'js-yaml';

export interface K8sConfig {
  memory?: string;
  cpu?: string;
  replicas?: number;
}

export interface ServiceConfig {
  name?: string;
  version?: string;
  [key: string]: any;
}

export interface ParsedYaml {
  metadata?: Record<string, any>;
  spec?: Record<string, any>;
  services?: ServiceConfig[];
  env?: Record<string, string | number | boolean>;
  [key: string]: any;
}

export const parseYamlContent = (content: string): ParsedYaml => {
  try {
    const parsed = YAML.load(content) as any;

    // Handle different YAML structures
    if (Array.isArray(parsed)) {
      // If it's an array of services
      return {
        services: parsed,
      };
    } else if (parsed.services) {
      // If it already has a services key
      return parsed;
    } else if (parsed.metadata && parsed.spec) {
      // If it's the new nested structure (metadata + spec)
      return {
        metadata: parsed.metadata,
        spec: parsed.spec,
        services: [],
      };
    } else if (parsed.spec && !parsed.metadata) {
      // Just spec without metadata
      return {
        spec: parsed.spec,
        services: [],
      };
    } else {
      // Single service or other structure
      return {
        services: [parsed],
      };
    }
  } catch (error) {
    console.error('Error parsing YAML:', error);
    throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseYamlFile = async (file: File): Promise<ParsedYaml> => {
  try {
    const content = await file.text();
    return parseYamlContent(content);
  } catch (error) {
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchYamlFromGitlab = async (
  gitlabUrl: string,
  filePath: string,
  token?: string
): Promise<ParsedYaml> => {
  try {
    // Parse GitLab repo URL and construct raw file URL
    const url = `${gitlabUrl}/-/raw/main/${filePath}`;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['PRIVATE-TOKEN'] = token;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const content = await response.text();
    return parseYamlContent(content);
  } catch (error) {
    throw new Error(`Failed to fetch YAML from GitLab: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
