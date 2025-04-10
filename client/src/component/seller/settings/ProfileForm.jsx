import { useState } from 'react';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: 'Yumna',
    lastName: 'Shahd',
    gender: 'Female',
    birthDate: '23 December 2003',
    email: 'YumnaShahd@gmail.com',
    phone: '+20121212122',
    country: 'Egypt',
    address: 'Gharbia, Egypt'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Date of Birth</label>
          <input
            type="text"
            name="birthDate"
            value={profile.birthDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={profile.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;