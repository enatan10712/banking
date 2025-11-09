import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../lib/api';

// ------------------ TYPES ------------------
type User = {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ------------------ COMPONENT ------------------
export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');

  // Fetch users
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<User[]>('/users');
      return res.data;
    },
    retry: false,
  });

  // Toggle active status
  const toggleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return api.patch(`/users/${id}/status`, { is_active: isActive });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  // Update role
  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: 'admin' | 'customer' }) => {
      return api.patch(`/users/${id}`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <div className="p-4 text-slate-300">Loading users…</div>;
  if (isError)
    return (
      <div className="p-4 space-y-3 text-slate-300">
        <p className="text-sm">Failed to load users. Make sure you are logged in as an admin and the API is running.</p>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );

  const baseUsers = users ?? [];
  const filteredUsers = roleFilter === 'all' ? baseUsers : baseUsers.filter((u) => u.role === roleFilter);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Users</h1>

      {/* Role Filter */}
      <div className="mb-4">
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as 'all' | 'admin' | 'customer')}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Full Name</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.full_name}</td>
              <td className="border px-2 py-1">
                <select
                  value={user.role}
                  onChange={(e) =>
                    updateRole.mutate({ id: user.id, role: e.target.value as 'admin' | 'customer' })
                  }
                  className="border px-1 py-0.5 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </td>
              <td className="border px-2 py-1">{user.is_active ? 'Active' : 'Inactive'}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => toggleStatus.mutate({ id: user.id, isActive: !user.is_active })}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
