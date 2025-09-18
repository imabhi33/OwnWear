import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../api/profileService';
import { toast } from 'sonner';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    gender: '',
    dateOfBirth: '',
  });
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        mobile: profile.mobile || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await profileService.updateProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await profileService.uploadProfilePic(formData);
      setProfile(response.data);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await profileService.addAddress(newAddress);
      setProfile(prev => ({ ...prev, addresses: response.data }));
      setNewAddress({
        type: 'home',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await profileService.deleteAddress(addressId);
      setProfile(prev => ({ ...prev, addresses: response.data }));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile?.profilePic || '/placeholder.png'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-white text-purple-500 p-1 rounded-full cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profile?.firstName} {profile?.lastName}</h2>
                <p className="text-gray-200">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors font-medium shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6 bg-white rounded-b-lg">
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 font-medium">First Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-800">{profile?.firstName || '-'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 font-medium">Last Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-800">{profile?.lastName || '-'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 font-medium">Mobile</label>
                <p className="mt-1 text-lg font-semibold text-gray-800">{profile?.mobile || '-'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 font-medium">Gender</label>
                <p className="mt-1 text-lg font-semibold text-gray-800 capitalize">{profile?.gender || '-'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 font-medium">Date of Birth</label>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Addresses Section */}
      <div className="mt-6 max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <div className="bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Addresses</h3>
            <button
              onClick={() => setShowAddressForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Add New Address
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={newAddress.type}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleAddressInputChange}
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleAddressInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Add Address
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {profile?.addresses?.map((address) => (
              <div key={address._id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{address.street}</p>
                  <p className="text-sm text-gray-700">{address.city}, {address.state}</p>
                  <p className="text-sm text-gray-700">PIN: {address.pincode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;