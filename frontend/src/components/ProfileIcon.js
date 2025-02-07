import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileIcon.css";
import { FaUserCircle } from "react-icons/fa";

const ProfileIcon = () => {
  const navigate = useNavigate();

  const handleIconClick = () => {
    console.log("Profile icon clicked");
  };

  return (
    <div className="profile-icon-container" onClick={handleIconClick}>
      <FaUserCircle className="profile-icon" />
    </div>
  );
};

export default ProfileIcon;
