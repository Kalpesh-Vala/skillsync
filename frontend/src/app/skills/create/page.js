'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { skillsAPI } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function CreateSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    initialRating: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialRating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await skillsAPI.createSkill(formData);
      if (response.data.status === 'success') {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Add New Skill
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Skill Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="category"
                    id="category"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="initialRating" className="block text-sm font-medium text-gray-700">
                  Initial Rating (1-5)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="initialRating"
                    id="initialRating"
                    min="1"
                    max="5"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.initialRating}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Creating...' : 'Create Skill'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}