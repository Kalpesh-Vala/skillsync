'use client';

import { useEffect, useState } from 'react';
import { skillsAPI } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function DashboardPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsAPI.getAllSkills();
        if (response.data.status === 'success') {
          setSkills(response.data.data.skills);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillsAPI.deleteSkill(skillId);
      setSkills(skills.filter(skill => skill.id !== skillId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill');
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

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Your Skills</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage your skills progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/skills/create"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Skill
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{skill.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {skill.category}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Current Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">{skill.currentRating}/5</p>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex justify-between space-x-3">
                  <Link
                    href={`/skills/${skill.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500">No skills added yet. Start by adding a new skill!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}