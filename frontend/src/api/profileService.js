import api from './apiService';

export const getProfile = () => {
  return api.get('/profile');
};

export const updateProfile = (profileData) => {
  return api.put('/profile', profileData);
};

export const uploadProfilePic = (formData) => {
  return api.post('/profile/profile-pic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addAddress = (addressData) => {
  return api.post('/profile/address', addressData);
};

export const updateAddress = (addressId, addressData) => {
  return api.put(`/profile/address/${addressId}`, addressData);
};

export const deleteAddress = (addressId) => {
  return api.delete(`/profile/address/${addressId}`);
};