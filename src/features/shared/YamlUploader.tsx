'use client';

import { useState, useRef } from 'react';
import { parseYamlFile, fetchYamlFromGitlab, ParsedYaml } from '@/lib/yamlParser';

interface YamlUploaderProps {
  onYamlLoaded: (data: ParsedYaml) => void;
  isLoading?: boolean;
}

interface GitlabFormData {
  url: string;
  filePath: string;
  token: string;
}

export const YamlUploader = ({ onYamlLoaded, isLoading = false }: YamlUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showGitlab, setShowGitlab] = useState(false);
  const [gitlabData, setGitlabData] = useState<GitlabFormData>({
    url: '',
    filePath: 'config.yaml',
    token: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const data = await parseYamlFile(file);
      onYamlLoaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleGitlabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gitlabData.url || !gitlabData.filePath) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      const data = await fetchYamlFromGitlab(gitlabData.url, gitlabData.filePath, gitlabData.token);
      onYamlLoaded(data);
      setGitlabData({ url: '', filePath: 'config.yaml', token: '' });
      setShowGitlab(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-3">
        <h2 className="font-semibold text-lg">Load YAML Configuration</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setShowGitlab(false);
              setError(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              !showGitlab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => {
              setShowGitlab(true);
              setError(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              showGitlab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Load from GitLab
          </button>
        </div>

        {!showGitlab ? (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <p className="text-gray-600 mb-2">
                <span className="text-3xl mb-2 block">📁</span>
                Click to upload or drag and drop
              </p>
              <p className="text-gray-400 text-sm">YAML files only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        ) : (
          <form onSubmit={handleGitlabSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitLab Repository URL *
              </label>
              <input
                type="text"
                placeholder="https://gitlab.com/group/project"
                value={gitlabData.url}
                onChange={(e) =>
                  setGitlabData({ ...gitlabData, url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Path in Repository *
              </label>
              <input
                type="text"
                placeholder="config.yaml"
                value={gitlabData.filePath}
                onChange={(e) =>
                  setGitlabData({ ...gitlabData, filePath: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitLab Personal Token (optional)
              </label>
              <input
                type="password"
                placeholder="your-gitlab-token"
                value={gitlabData.token}
                onChange={(e) =>
                  setGitlabData({ ...gitlabData, token: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load from GitLab'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default YamlUploader;
