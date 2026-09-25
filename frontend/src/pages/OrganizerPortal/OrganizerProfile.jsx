import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './OrganizerProfile.css';

function OrganizerProfile({ theme, toggleTheme, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem('organizerData'));

  const [profile, setProfile] = useState({
    orgName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
    description: '',
    website: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.id) {
      navigate('/organizer/login');
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8081/api/organizers/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setProfile({
          orgName: data.orgName || '',
          email: data.email || '',
          phone: data.phone || '',
          profileImageUrl: data.profileImageUrl || '',
          description: data.description || '',
          website: data.website || ''
        });
      })
      .catch(err => console.error("Error fetching profile", err))
      .finally(() => setLoading(false));
  }, [user?.id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      
      // Local preview
      const reader = new FileReader();
      reader.onload = (upload) => {
        setProfile(prev => ({...prev, profileImageUrl: upload.target.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      // 1. If an image file is selected, upload it first
      let updatedImageUrl = profile.profileImageUrl;
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('file', selectedImageFile);
        
        const uploadRes = await fetch(`http://localhost:8081/api/organizers/${user.id}/upload-profile-image`, {
          method: 'POST',
          body: formData
        });
        
        if (uploadRes.ok) {
          const updatedOrg = await uploadRes.json();
          updatedImageUrl = updatedOrg.profileImageUrl;
          setProfile(prev => ({...prev, profileImageUrl: updatedImageUrl}));
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // 2. Update the rest of the profile
      const res = await fetch(`http://localhost:8081/api/organizers/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: profile.orgName,
          phone: profile.phone,
          profileImageUrl: updatedImageUrl, // Use the new URL if we just uploaded one
          description: profile.description,
          website: profile.website
        })
      });
      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setSelectedImageFile(null); // Clear selected file after successful save
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className={`organizer-portal-wrapper ${theme}-mode`}>
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2 className="dashboard-header-title" style={{cursor: 'pointer'}} onClick={() => navigate('/organizer/dashboard')}>
            <span className="dashboard-header-name">{profile.orgName || 'Organizer'}</span> Portal
          </h2>
        </div>
        <div className="dashboard-header-right">
          <button className="create-event-btn" onClick={() => navigate('/organizer/dashboard')}>Dashboard</button>
          <button className="logout-header-btn" onClick={handleLogoutClick}>Logout</button>
        </div>
      </header>

      <main className="organizer-profile-main">
        <div className="profile-container">
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Update your organization's details, logo, and bio.</p>
          
          {successMsg && <div className="success-alert">{successMsg}</div>}
          
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="profile-form">
              
              <div className="profile-header-preview">
                <div 
                  className="profile-logo-preview" 
                  style={{ backgroundImage: `url(${profile.profileImageUrl || 'https://via.placeholder.com/150?text=Logo'})`}}
                ></div>
                <div className="profile-header-info">
                  <h3>{profile.orgName}</h3>
                  <p>{profile.email}</p>
                </div>
              </div>

              <div className="form-group">
                <label>Organization Name</label>
                <input type="text" name="orgName" value={profile.orgName} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Email (Read-only)</label>
                  <input type="email" value={profile.email} disabled className="disabled-input" />
                </div>
                <div className="form-group half">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Profile Image (Logo)</label>
                <div className="file-upload-wrapper">
                  <input 
                    type="file" 
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="profileImage" className="file-input-label">
                    {selectedImageFile ? selectedImageFile.name : 'Choose an image from your device...'}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Website URL</label>
                <input type="url" name="website" value={profile.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
              </div>

              <div className="form-group">
                <label>Description / Bio</label>
                <textarea name="description" value={profile.description} onChange={handleChange} rows="4" placeholder="Tell attendees about your organization..."></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-profile-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OrganizerProfile;
