import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/ProfileIcon.css";

const ProfileIcon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    email: "",
    dob: "",
    location: "",
    pronouns: "",
    profile_pic: "", // This will stay for display only, not editing
  });
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (showPopup) {
      fetchProfile();
    }
  }, [showPopup]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
        params: { user_id: userId },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user/update`, {
        user_id: userId,
        display_name: profile.display_name || "",
        dob: profile.dob || "",
        location: profile.location || "",
        pronouns: profile.pronouns || "",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  
    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };
  
  // Apply dark mode on initial load if enabled
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleChangePassword = async () => {
    const oldPassword = prompt("Enter your old password:");
    if (!oldPassword) return;
  
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
      });
  
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to change password.");
    }
  };
  

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
  
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/delete`, {
        data: { user_id: userId }, // Send user ID in request body
      });
  
      // Clear user session data
      localStorage.removeItem("userId");
      localStorage.removeItem("darkMode");
  
      alert("Your account has been deleted.");
      window.location.href = "/register"; // Redirect to register page
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };
  

  const renderContent = () => {
    if (activeTab === "Profile") {
      return (
        <div className="popup-content-section">
          <h2>Profile</h2>
          {profile.profile_pic ? (
            <img src={profile.profile_pic} alt="Profile" className="profile-pic-preview" />
          ) : (
            <FaUserCircle className="profile-icon-large" />
          )}
          {isEditing ? (
            <div className="edit-section">
              <label>Display Name:</label>
              <input
                type="text"
                name="display_name"
                value={profile.display_name}
                onChange={handleChange}
              />

              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
              />

              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />

              <label>Pronouns:</label>
              <input
                type="text"
                name="pronouns"
                value={profile.pronouns}
                onChange={handleChange}
              />

              <div className="button-group">
                <button className="action-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {profile.display_name || "N/A"}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>DOB:</strong> {profile.dob || "N/A"}</p>
              <p><strong>Location:</strong> {profile.location || "N/A"}</p>
              <p><strong>Pronouns:</strong> {profile.pronouns || "N/A"}</p>
              <button className="action-button" onClick={handleEdit}>Edit Profile</button>
            </>
          )}
        </div>
      );
    }

    if (activeTab === "Settings") {
      return (
        <div className="popup-content-section">
          <h2>Settings</h2>
          <div className="settings-section">
            <button className="action-button" onClick={handleChangePassword}>
              Change Password
            </button>
            <button className="action-button" onClick={handleToggleDarkMode}>
              {isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
            </button>
          </div>
          <div className="delete-section">
            <p className="warning">This action cannot be undone!</p>
            <button className="delete-account-button" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "Help") {
      return (
        <div className="popup-content-section">
          <h2>Help</h2>
          <p>Need assistance? Here are some options:</p>
          <ul>
            <li>FAQs: <a href="/faq">View FAQs</a></li>
            <li>Support: <a href="mailto:support@example.com">Contact Support</a></li>
          </ul>
        </div>
      );
    }

    if (activeTab === "Logout") {
      return (
        <div className="popup-content-section">
          <h2>Logout</h2>
          <p>Are you sure you want to logout?</p>
          <button className="logout-button" onClick={() => console.log("Logged out")}>
            Confirm Logout
          </button>
        </div>
      );
    }

    return <p>Content not found.</p>;
  };

  return (
    <>
      <div className="profile-icon-container" onClick={togglePopup}>
        <FaUserCircle className="profile-icon" />
      </div>
      {showPopup && (
        <div className="settings-popup-overlay" onClick={togglePopup}>
          <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-sidebar">
              <ul>
                <li className={activeTab === "Profile" ? "active" : ""} onClick={() => setActiveTab("Profile")}>
                  Profile
                </li>
                <li className={activeTab === "Settings" ? "active" : ""} onClick={() => setActiveTab("Settings")}>
                  Settings
                </li>
              </ul>
            </div>
            <div className="popup-main">{renderContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileIcon;
