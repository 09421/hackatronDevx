'use client';

import { useState } from 'react';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateService: (serviceData: ServiceFormData) => void;
}

export interface ServiceFormData {
  name: string;
  owner: string;
  cpu: string;
  memory: string;
  podCount: number;
  description?: string;
  gitlabRepoUrl?: string;
  databases?: {
    postgres?: boolean;
    redis?: boolean;
    elasticsearch?: boolean;
  };
}

export const CreateServiceModal = ({ isOpen, onClose, onCreateService }: CreateServiceModalProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    owner: '',
    cpu: '100m',
    memory: '256Mi',
    podCount: 1,
    description: '',
    gitlabRepoUrl: '',
    databases: {
      postgres: false,
      redis: false,
      elasticsearch: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'podCount' ? parseInt(value, 10) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleDatabaseChange = (database: keyof NonNullable<ServiceFormData['databases']>) => {
    setFormData((prev) => ({
      ...prev,
      databases: {
        ...prev.databases,
        [database]: !prev.databases?.[database],
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    } else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(formData.name)) {
      newErrors.name = 'Service name must start with lowercase letter/digit and contain only lowercase letters, digits, and hyphens';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    if (!formData.cpu.trim()) {
      newErrors.cpu = 'CPU limit is required';
    }

    if (!formData.memory.trim()) {
      newErrors.memory = 'Memory limit is required';
    }

    if (formData.podCount < 1) {
      newErrors.podCount = 'Pod count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onCreateService(formData);
    setFormData({
      name: '',
      owner: '',
      cpu: '100m',
      memory: '256Mi',
      podCount: 1,
      description: '',
      gitlabRepoUrl: '',
      databases: {
        postgres: false,
        redis: false,
        elasticsearch: false,
      },
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Service</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., my-service"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Owner */}
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
              Owner <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              placeholder="e.g., team-name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.owner ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.owner && <p className="text-sm text-red-500 mt-1">{errors.owner}</p>}
          </div>

          {/* CPU Limit */}
          <div>
            <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-1">
              CPU Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cpu"
              name="cpu"
              value={formData.cpu}
              onChange={handleInputChange}
              placeholder="e.g., 100m"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cpu ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cpu && <p className="text-sm text-red-500 mt-1">{errors.cpu}</p>}
          </div>

          {/* Memory Limit */}
          <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700 mb-1">
              Memory Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="memory"
              name="memory"
              value={formData.memory}
              onChange={handleInputChange}
              placeholder="e.g., 256Mi"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.memory ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.memory && <p className="text-sm text-red-500 mt-1">{errors.memory}</p>}
          </div>

          {/* Pod Count */}
          <div>
            <label htmlFor="podCount" className="block text-sm font-medium text-gray-700 mb-1">
              Pod Count <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="podCount"
              name="podCount"
              value={formData.podCount}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.podCount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.podCount && <p className="text-sm text-red-500 mt-1">{errors.podCount}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional service description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GitLab Repository URL */}
          <div>
            <label htmlFor="gitlabRepoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              GitLab Repository URL
            </label>
            <input
              type="url"
              id="gitlabRepoUrl"
              name="gitlabRepoUrl"
              value={formData.gitlabRepoUrl}
              onChange={handleInputChange}
              placeholder="e.g., https://gitlab.com/username/repo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Specify where the service files should be created</p>
          </div>

          {/* Databases Section */}
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">Databases (Optional)</label>
            <div className="space-y-2">
              {[
                { id: 'postgres', label: '🐘 PostgreSQL' },
                { id: 'redis', label: '⚡ Redis' },
                { id: 'elasticsearch', label: '🔍 Elasticsearch' },
              ].map((db) => (
                <label key={db.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.databases?.[db.id as keyof NonNullable<ServiceFormData['databases']>] || false}
                    onChange={() => handleDatabaseChange(db.id as keyof NonNullable<ServiceFormData['databases']>)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{db.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;
