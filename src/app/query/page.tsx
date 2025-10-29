'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/lib/services/query';
import { UserWithProfile, SearchFilters } from '@/lib/services/query/types';

// Debounce hook for instant search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function QueryPage() {
  const [data, setData] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'profiles'>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const itemsPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    } else {
      loadData();
    }
  }, [debouncedSearchTerm, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result: UserWithProfile[] = await UserService.getUsersWithProfiles();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!debouncedSearchTerm.trim()) {
      await loadData();
      return;
    }

    try {
      setLoading(true);
      let result: UserWithProfile[] = [];
      
      switch (activeTab) {
        case 'users':
          const users = await UserService.searchUsers(debouncedSearchTerm, filters);
          const usersWithProfiles = await Promise.all(
            users.map(user => UserService.getUserWithProfile(user.userId))
          );
          result = usersWithProfiles.filter((user): user is UserWithProfile => user !== null);
          break;
        case 'profiles':
          const profilesData = await UserService.getUsersWithProfiles();
          result = profilesData.filter(item =>
            item.profile?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.profile?.phoneNumber?.includes(debouncedSearchTerm)
          );
          break;
        default:
          result = [];
      }
      
      setData(result);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, activeTab, filters]);

  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({});
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-200 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
        <button 
          onClick={handleRefresh}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Database Query Interface</h1>
          <p className="text-slate-400">Browse and search through user data</p>
        </div>
        
        {/* Search and Controls */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by email, name, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'users'
                  ? 'bg-slate-600 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-650'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users Table
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-slate-600 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-650'
              }`}
              onClick={() => setActiveTab('profiles')}
            >
              Profiles Table
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="overflow-x-auto">
            {activeTab === 'users' && <UsersTable data={currentData} />}
            {activeTab === 'profiles' && <ProfilesTable data={currentData} />}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-750">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Showing <span className="font-medium text-slate-200">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-slate-200">{Math.min(startIndex + itemsPerPage, data.length)}</span> of{' '}
                  <span className="font-medium text-slate-200">{data.length}</span> entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-slate-700 text-slate-300 border border-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-slate-300">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-slate-700 text-slate-300 border border-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            {searchTerm ? `Found ${data.length} results for "${searchTerm}"` : `Showing ${data.length} total records`}
          </p>
        </div>
      </div>
    </div>
  );
}

// Users Table Component
function UsersTable({ data }: { data: UserWithProfile[] }) {
  return (
    <table className="min-w-full divide-y divide-slate-700">
      <thead className="bg-slate-750">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User ID</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created By</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created At</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Updated By</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Updated At</th>
        </tr>
      </thead>
      <tbody className="bg-slate-800 divide-y divide-slate-700">
        {data.map((user) => (
          <tr key={user.userId} className="hover:bg-slate-750 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{user.userId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                user.role === 'user' ? 'bg-blue-500/20 text-blue-300' :
                'bg-slate-500/20 text-slate-300'
              }`}>
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{user.createdBy || 'System'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{user.updatedBy || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
              {new Date(user.updatedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Profiles Table Component
function ProfilesTable({ data }: { data: UserWithProfile[] }) {
  return (
    <table className="min-w-full divide-y divide-slate-700">
      <thead className="bg-slate-750">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User ID</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Birthdate</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Sex</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Age</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created By</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created At</th>
        </tr>
      </thead>
      <tbody className="bg-slate-800 divide-y divide-slate-700">
        {data.map((user) => (
          <tr key={user.userId} className="hover:bg-slate-750 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{user.userId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.profile?.name || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.profile?.phoneNumber || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
              {user.profile?.birthdate ? new Date(user.profile.birthdate).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {user.profile?.sex && (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.profile.sex.toLowerCase() === 'male' ? 'bg-blue-500/20 text-blue-300' :
                  user.profile.sex.toLowerCase() === 'female' ? 'bg-pink-500/20 text-pink-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {user.profile.sex}
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.profile?.age || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{user.profile?.createdBy || 'System'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
              {user.profile?.createdAt ? new Date(user.profile.createdAt).toLocaleDateString() : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}