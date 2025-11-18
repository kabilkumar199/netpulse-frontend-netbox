import React, { useState } from 'react';
import axios from 'axios';
import {api} from '../../services/api/api';
import { User, Plus, Edit, Trash2, Shield, Mail, Phone, Calendar, Search, Filter, MoreVertical } from 'lucide-react';
import { API_ENDPOINTS } from "../../helpers/url_helper";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { validationSchemas } from '../../utils/validation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
  phone?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserListProps {
  onClose?: () => void;
}
type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
};


const UserList: React.FC<UserListProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const mapApiUserToComponentUser = (apiUser: any): User => {
    const [firstName, ...lastNameParts] = apiUser.username.split('@')[0].split('.');
    const lastName = lastNameParts.join('.') || ' ';

    let componentRole = 'User';
    if (apiUser.roles === 'ROLE_ADMIN') {
      componentRole = 'Admin';

    } else if (apiUser.roles === 'ROLE_USER') {
      componentRole = 'User';
    }

    return {
      id: apiUser.userId,
      firstName: firstName || apiUser.username,
      lastName: lastName,
      email: apiUser.email,
      role: componentRole,
      phone: apiUser.phoneNumber || undefined,
      createdAt: apiUser.createdDate ? new Date(apiUser.createdDate) : new Date(),
      updatedAt: new Date(),
      status: 'active',
      department: undefined,
      lastLogin: undefined,
    };
  };
  const createInitialValues: UserFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'User',
    phone: ''
  };

  const editInitialValues: UserFormValues = {
    firstName: '',
    lastName: '',
    email: editingUser?.email || '',
    password: '',
    role: editingUser?.role || 'User',
    phone: ''
  };
  const handleFormSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>
  ) => {
    if (editingUser) {
      await handleUpdateUser(values);
    } else {
      await handleCreateUser(values);
    }
    setSubmitting(false);
  };

  const fetchUsers = React.useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // api.get returns "data" directly, NOT AxiosResponse
    const apiData = await api.get<User[]>(API_ENDPOINTS.GET_USERS);

    const mappedUsers = apiData.map(mapApiUserToComponentUser);
    setUsers(mappedUsers);

  } catch (err) {
    let message = 'An unknown error occurred';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    setError(message);
    console.error('Error fetching users:', message);
    toast.error(`Failed to load users: ${message}`);
  } finally {
    setLoading(false);
  }
}, []);


  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const roles = ['Admin', 'User'];
  // const departments = ['IT', 'Network Operations', 'Security', 'External'];
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const mapRoleToApiArray = (componentRole: string): string[] => {
    if (componentRole === 'Admin') {
      return ['admin'];
    }
    return ['user'];
  };
  const mapRoleToApiString = (componentRole: string): string => {
    return componentRole.toLowerCase();
  };

  const handleCreateUser = async (values: UserFormValues) => {
    const username = `${values.firstName}${values.lastName}`
      .toLowerCase()
      .replace(/\s+/g, '');

    const payload = {
      firstname:values.firstName,
      lastname:values.lastName,
      username: username,
      email: values.email,
      password: values.password,
      role: mapRoleToApiArray(values.role)
    };

    try {
      await api.post(API_ENDPOINTS.CREATE_USER, payload);
      setShowCreateModal(false);
      await fetchUsers();
      toast.success('🎉 User created successfully!');
    } catch (error) {
      let message = 'Failed to create user';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      console.error('Error creating user:', message);
      toast.error(message);
    }
  };

  const handleUpdateUser = async (values: UserFormValues) => {
    if (!editingUser) return;

    const payload: {
      // email: string;
      userId: string;
      role: string;
      newPassword?: string;
    } = {
      // email: values.email,
      userId: editingUser.id,
      role: mapRoleToApiString(values.role),
    };

    if (values.password) {
      payload.newPassword = values.password;
    }
    console.log("Sending payload to PUT /user:", payload);
    try {
      await api.put(API_ENDPOINTS.UPDATE_USER, payload);
      setEditingUser(null);
      setShowCreateModal(false);
      await fetchUsers();
      toast.success('✔️ User updated successfully!');
    } catch (error) {
      let message = 'Failed to update user';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      console.error('Error updating user:', message);
      toast.error(message);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowCreateModal(true);
  };
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`${API_ENDPOINTS.DELETE_USER}/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('🗑️ User deleted successfully!');
      } catch (error) {
        let message = 'Failed to delete user';
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        console.error('Error deleting user:', message);
        toast.error(message);
      }
    }
  };

  const handleStatusChange = (userId: string, status: 'active' | 'inactive') => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status, updatedAt: new Date() }
        : user
    ));
  };


  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active': return 'bg-green-900 text-green-300';
  //     case 'inactive': return 'bg-red-900 text-red-300';
  //     default: return 'bg-gray-900 text-gray-300';
  //   }
  // };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-green-900 text-green-300';
      case 'User': return 'bg-red-900 text-red-300';
      case 'Super Admin': return 'bg-purple-900 text-purple-300';
      case 'Network Admin': return 'bg-blue-900 text-blue-300';
      case 'Network Operator': return 'bg-green-900 text-green-300';
      case 'Guest': return 'bg-gray-900 text-gray-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage system users and their access</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setEditingUser(null);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search users..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {loading && <p className="p-6 text-center">Loading users...</p>}
          {error && <p className="p-6 text-center text-red-400">{error}</p>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3  text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-medium text-white">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {user.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowCreateModal(true);
                            }}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">

              <h2 className="text-xl font-semibold text-white mb-6">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>

              <Formik
                initialValues={editingUser ? editInitialValues : createInitialValues}
                validationSchema={
                  editingUser
                    ? validationSchemas.userManagementUpdate
                    : validationSchemas.userManagementCreate
                }
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {!editingUser && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                            <Field
                              type="text"
                              name="firstName"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                              placeholder="First name"
                            />
                            <ErrorMessage name="firstName" component="p" className="text-sm text-red-400 mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                            <Field
                              type="text"
                              name="lastName"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                              placeholder="Last name"
                            />
                            <ErrorMessage name="lastName" component="p" className="text-sm text-red-400 mt-1" />
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="user@company.com"
                      // disabled={!!editingUser} 
                      />
                      <ErrorMessage name="email" component="p" className="text-sm text-red-400 mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {editingUser ? 'New Password (optional)' : 'Password'}
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                      />
                      <ErrorMessage name="password" component="p" className="text-sm text-red-400 mt-1" />
                    </div>

                    {/* --- Role --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="role" component="p" className="text-sm text-red-400 mt-1" />
                    </div>

                    {!editingUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                        <Field
                          type="tel"
                          name="phone"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                        <ErrorMessage name="phone" component="p" className="text-sm text-red-400 mt-1" />
                      </div>
                    )}

                    {/* --- Submit/Cancel Buttons --- */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : (editingUser ? 'Update User' : 'Create User')}
                      </button>
                    </div>

                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
