import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { getToken } from '../utils/token';

const Account = () => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    profile_image: '',
    role_name: '',
  });
  const [newName, setNewName] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (token) {
      // Fetch profile data on component load
      axios
        .get('https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { name, phone, profile_image, role_name } = response.data;
          setProfile({ name, phone, profile_image, role_name });
          setNewName(name); // Pre-fill the new name
        })
        .catch((error) => {
          setError('Error fetching profile');
          console.error('Error fetching profile:', error);
        });
    } else {
      setError('Token is missing');
    }
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('name', newName);
    if (newProfileImage) {
      formData.append('profile_image', newProfileImage);
    }

    try {
      await axios.post('https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refetch profile data after update
      const response = await axios.get('https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, phone, profile_image, role_name } = response.data;
      setProfile({ name, phone, profile_image, role_name });
      setNewProfileImage(null); // Reset the profile image input
      alert('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validasi kata sandi
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('New password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError('New password must contain at least one lowercase letter');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('New password must contain at least one symbol');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    setPasswordLoading(true); // Start loading

    try {
      await axios.put(
        'https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/password',
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert('Password updated successfully');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || error.response.data.error || 'Failed to update password';
        setError(`Failed to update password: ${errorMessage}`);
      } else {
        setError('Failed to update password');
      }
      console.error('Error updating password:', error.response ? error.response.data : error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold">Account</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <img src={profile.profile_image} alt="Profile" className="w-32 h-32 rounded-full border-2 border-gray-300" />
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.phone}</p>
              <p className="text-gray-600">{profile.role_name}</p>
            </div>
          </div>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile} className="mt-8">
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Profile Image</label>
              <input type="file" onChange={(e) => setNewProfileImage(e.target.files[0])} className="mt-1" />
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded flex items-center" disabled={isLoading}>
              {isLoading && (
                <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8m0 0a8 8 0 0 1 8 8m-8-8v16" />
                </svg>
              )}
              Update Profile
            </button>
          </form>

          {/* Update Password Form */}
          <form onSubmit={handleUpdatePassword} className="mt-8">
            <div className="mb-4">
              <label className="block text-gray-700">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 p-2 border rounded w-full" required />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 p-2 border rounded w-full" required />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 p-2 border rounded w-full" required />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
