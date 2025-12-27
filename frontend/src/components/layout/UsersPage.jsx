'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Trash2, Edit2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import UserModal from '@/components/user/UserModal';
import api from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.users.delete(id);
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Name', 
      render: (row) => <span className="font-medium text-gray-900">{row.name}</span> 
    },
    { 
      key: 'email', 
      label: 'Email', 
      render: (row) => <span className="text-gray-700">{row.email}</span> 
    },
    { 
      key: 'role', 
      label: 'Role', 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.role}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      render: (row) => <span className="text-gray-700">{new Date(row.createdAt).toLocaleDateString()}</span> 
    },
  ];

  return (
    <>
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Users size={20} className="mr-2" />
            User Management
          </h2>
        </div>
        <Table
          columns={columns}
          data={users}
          actions={(row) => (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(row)}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition transform hover:scale-110"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(row._id)} 
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition transform hover:scale-110"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </Card>

      <UserModal
        key={selectedUser?._id || 'new'}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          fetchUsers(); // Refresh the list
        }}
      />
    </>
  );
}