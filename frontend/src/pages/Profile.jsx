import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../api/profileService';
import { toast } from 'sonner';
import { UserCircleIcon, CameraIcon, PencilIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

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
      toast.success('Profile updated successfully! ✨');
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
      toast.success('Profile picture updated! 📸');
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
      toast.success('Address added successfully! 📍');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await profileService.deleteAddress(addressId);
      setProfile(prev => ({ ...prev, addresses: response.data }));
      toast.success('Address deleted');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-fadeInUp">
          <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                    {profile?.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600">
                        <UserCircleIcon className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-teal-50 transition-colors group">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                    />
                    <CameraIcon className="w-5 h-5 text-teal-600" />
                  </label>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      {user?.email}
                    </div>
                    {profile?.mobile && (
                      <div className="flex items-center gap-1">
                        <PhoneIcon className="w-4 h-4" />
                        {profile.mobile}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">First Name</p>
                    <p className="text-lg font-semibold text-gray-800">{profile?.firstName || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Last Name</p>
                    <p className="text-lg font-semibold text-gray-800">{profile?.lastName || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Mobile</p>
                    <p className="text-lg font-semibold text-gray-800">{profile?.mobile || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{profile?.gender || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {showAddressForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mb-6 p-6 bg-teal-50 rounded-xl border-2 border-teal-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type</label>
                      <select
                        name="type"
                        value={newAddress.type}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                        required
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressInputChange}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleAddressInputChange}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Set as default</label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {profile?.addresses?.length > 0 ? (
                  profile.addresses.map((address) => (
                    <div key={address._id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full capitalize">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-800 font-medium">{address.street}</p>
                          <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No saved addresses yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                  <span className="text-gray-700">Total Orders</span>
                  <span className="text-2xl font-bold text-teal-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-coral-50 rounded-lg">
                  <span className="text-gray-700">Wishlist Items</span>
                  <span className="text-2xl font-bold text-coral-500">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Saved Addresses</span>
                  <span className="text-2xl font-bold text-blue-600">{profile?.addresses?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <CalendarIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Member Since</h3>
              <p className="text-2xl font-bold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
