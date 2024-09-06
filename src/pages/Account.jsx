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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded flex items-center"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading && (
                <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8m0 0a8 8 0 0 1 8 8m-8-8v16" />
                </svg>
              )}
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;

// alba
