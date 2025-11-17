import React, { useState } from "react";
import {
  User,Mail,Phone,MapPin,Calendar,Shield,Settings,Key,Bell,Globe,Camera,Edit,Save,X,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import { validationSchemas } from "../../utils";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from '../../helpers/url_helper';
import axiosInstance from "../../services/api/api";
import api from "../../services/api/api";
import axios from "axios";
import type { RootState } from "../../store/store"; 

interface UserProfileProps {
  onClose?: () => void;
}
type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  // const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });


  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Carter",
    email: "john.carter@company.com",
    phone: "+1 (555) 123-4567",
    department: "IT",
    role: "Super Admin",
    location: "San Francisco, CA",
    bio: "Network Administrator with 10+ years of experience in enterprise network management.",
    avatar: null as string | null,
    joinedDate: "January 15, 2024",
    lastLogin: "Today at 10:30 AM",
    timezone: "Pacific Time (UTC-8)",
    language: "English",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: true,
      lastPasswordChange: "December 1, 2023",
      loginAttempts: 0,
    },
  });

  const [editProfile, setEditProfile] = useState(profile);
  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditProfile({ ...editProfile, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    // { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];
  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePasswordSubmit = async (
    values: PasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>
  ) => {

    const userString = localStorage.getItem('user');
    console.log("1. Raw string from localStorage:", userString); // <-- ADD THIS
    if (!userString) {
      toast.error('Error: Could not find user. Please log in again.');
      setSubmitting(false);
      return;
    }
    const loggedInUser = JSON.parse(userString);
    console.log(loggedInUser);
    
    if (!loggedInUser.id) {
      toast.error('Error: User ID is missing.');
      setSubmitting(false);
      return;
    }
    const payload = {
      userId: loggedInUser.id,
      newPassword: values.newPassword,
    };
console.log("4. Sending this payload to PUT /user:", payload); 
    try {
      await api.put(API_ENDPOINTS.UPDATE_USER, payload);
      toast.success('🎉 Password changed successfully!');
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      let message = 'Failed to change password.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      console.error('Error changing password:', message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="  mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {editProfile.avatar ? (
                    <img
                      src={editProfile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {editProfile.firstName[0]}
                      {editProfile.lastName[0]}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {editProfile.firstName} {editProfile.lastName}
                </h3>
                <p className="text-gray-400">{editProfile.role}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {editProfile.department}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-800 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Profile Information
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editProfile.firstName}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editProfile.lastName}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editProfile.email}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editProfile.phone}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={editProfile.department}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            department: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editProfile.location}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            location: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editProfile.bio}
                      onChange={(e) =>
                        setEditProfile({ ...editProfile, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Read-only info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Joined</p>
                        <p className="text-white">{profile.joinedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Last Login</p>
                        <p className="text-white">{profile.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={editProfile.timezone}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            timezone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Pacific Time (UTC-8)">
                          Pacific Time (UTC-8)
                        </option>
                        <option value="Mountain Time (UTC-7)">
                          Mountain Time (UTC-7)
                        </option>
                        <option value="Central Time (UTC-6)">
                          Central Time (UTC-6)
                        </option>
                        <option value="Eastern Time (UTC-5)">
                          Eastern Time (UTC-5)
                        </option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={editProfile.language}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            language: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* --- Your 2FA Card --- */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${profile.security.twoFactor
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                              }`}
                          >
                            {profile.security.twoFactor ? "Enabled" : "Disabled"}
                          </span>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                            {profile.security.twoFactor ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* --- MODIFIED Change Password Card --- */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Change Password
                          </h3>
                          <p className="text-sm text-gray-400">
                            Last changed: {profile.security.lastPasswordChange}
                          </p>
                        </div>
                        {/* 4. This button now opens the modal */}
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* --- Your Login Activity Card --- */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          Login Activity
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          Recent failed login attempts:{" "}
                          {profile.security.loginAttempts}
                        </p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                          View all login activity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. THE NEW MODAL COMPONENT */}
              {isModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  {/* Modal Content Box */}
                  <div
                    className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        Change Password
                      </h3>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Modal Body (Formik) */}
                    <Formik
                      initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      }}
                      validationSchema={validationSchemas.passwordChange}
                      onSubmit={handleChangePasswordSubmit}
                    >
                      {({ isSubmitting }) => (
                        <Form className="space-y-4">

                          {/* Current Password */}
                          <div>
                            <label
                              htmlFor="currentPassword"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Current Password
                            </label>
                            <div className="relative">
                              <Field
                                type={visibility.current ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => toggleVisibility("current")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                              >
                                {visibility.current ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29-1.29m-2.637-2.637L4.5 5.25A9.95 9.95 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908l-4.242-4.242" /> </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.057 9.542 6.042C19.732 16.057 15.523 19 12 19c-4.478 0-8.268-2.943-9.542-6.958z" /> </svg>
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name="currentPassword"
                              component="p"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>

                          {/* New Password */}
                          <div>
                            <label
                              htmlFor="newPassword"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              New Password
                            </label>
                            <div className="relative">
                              <Field
                                type={visibility.new ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => toggleVisibility("new")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                              >
                                {visibility.new ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29-1.29m-2.637-2.637L4.5 5.25A9.95 9.95 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908l-4.242-4.242" /> </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.057 9.542 6.042C19.732 16.057 15.523 19 12 19c-4.478 0-8.268-2.943-9.542-6.958z" /> </svg>
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name="newPassword"
                              component="p"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>

                          {/* Confirm New Password */}
                          <div>
                            <label
                              htmlFor="confirmPassword"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Field
                                type={visibility.confirm ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => toggleVisibility("confirm")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                              >
                                {visibility.confirm ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29-1.29m-2.637-2.637L4.5 5.25A9.95 9.95 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908l-4.242-4.242" /> </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.057 9.542 6.042C19.732 16.057 15.523 19 12 19c-4.478 0-8.268-2.943-9.542-6.958z" /> </svg>
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name="confirmPassword"
                              component="p"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>

                          {/* Modal Footer (Buttons) */}
                          <div className="flex justify-end space-x-4 mt-6">
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {isSubmitting ? "Updating..." : "Update Password"}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Email Notifications
                          </h3>
                          <p className="text-sm text-gray-400">
                            Receive notifications via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editProfile.notifications.email}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                notifications: {
                                  ...editProfile.notifications,
                                  email: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Push Notifications
                          </h3>
                          <p className="text-sm text-gray-400">
                            Receive push notifications in the browser
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editProfile.notifications.push}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                notifications: {
                                  ...editProfile.notifications,
                                  push: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            SMS Notifications
                          </h3>
                          <p className="text-sm text-gray-400">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editProfile.notifications.sms}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                notifications: {
                                  ...editProfile.notifications,
                                  sms: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
function useSelector(arg0: (state: RootState) => any): { user: any; } {
  throw new Error("Function not implemented.");
}

