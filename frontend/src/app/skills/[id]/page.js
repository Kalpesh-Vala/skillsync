'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { skillsAPI } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';

export default function SkillDetailPage({ params }) {
  const router = useRouter();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRating, setNewRating] = useState(1);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await skillsAPI.getSkill(params.id);
        if (response.data.status === 'success') {
          setSkill(response.data.data.skill);
          setNewRating(response.data.data.skill.currentRating);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch skill details');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [params.id]);

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try {
      const response = await skillsAPI.updateProgress(params.id, { rating: newRating });
      if (response.data.status === 'success') {
        setSkill(response.data.data.skill);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!skill) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Skill not found</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{skill.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{skill.category}</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Current Rating</dt>
                <dd className="mt-1 text-sm text-gray-900">{skill.currentRating}/5</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Initial Rating</dt>
                <dd className="mt-1 text-sm text-gray-900">{skill.initialRating}/5</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Progress History</h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {skill.progress.map((entry, index) => (
                  <li key={entry._id}>
                    <div className="relative pb-8">
                      {index < skill.progress.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                            <span className="text-white text-sm">{entry.rating}</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Rating updated to <span className="font-medium text-gray-900">{entry.rating}/5</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Update Progress</h4>
            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleUpdateProgress} className="flex items-center space-x-4">
              <div>
                <label htmlFor="newRating" className="sr-only">New Rating</label>
                <input
                  type="number"
                  id="newRating"
                  name="newRating"
                  min="1"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Progress
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}