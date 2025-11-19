import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [updateMessage, setUpdateMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    setUpdateMessage('Profile updated successfully! (Demo mode - changes not persisted)');
    setIsEditing(false);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setUpdateMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p className="profile-role">{user?.role?.toUpperCase()}</p>
        </div>

        {updateMessage && (
          <div className="success-message">
            {updateMessage}
          </div>
        )}

        <div className="profile-content">
          {!isEditing ? (
            <>
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label>First Name</label>
                    <p>{user?.firstName || 'Not provided'}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Last Name</label>
                    <p>{user?.lastName || 'Not provided'}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Phone</label>
                    <p>{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>User ID</label>
                    <p className="profile-id">{user?.id || user?._id}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Account Status</label>
                    <p className="profile-status">
                      {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
                    </p>
                  </div>
                </div>
              </div>

              {user?.address && (
                <div className="profile-section">
                  <h2>Address</h2>
                  <div className="address-block">
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                    <p>{user.address.country}</p>
                  </div>
                </div>
              )}

              <div className="profile-actions">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => navigate('/orders')} 
                  className="btn btn-outline"
                >
                  View Orders
                </button>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline btn-danger"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="profile-edit-form">
              <h2>Edit Profile</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  title="Email cannot be changed"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

