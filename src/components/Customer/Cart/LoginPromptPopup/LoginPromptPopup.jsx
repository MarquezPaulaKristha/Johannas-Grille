import React from 'react';
import './LoginPromptPopup.css'; // You can style this popup accordingly

const LoginPromptPopup = ({ onClose }) => {
  return (
    <div className="loginpromptpopup-popup-overlay">
      <div className="loginpromptpopup-popup">
        <h3>You must be logged in to add items to your cart</h3>
        <button onClick={onClose} className="loginpromptpopup-btn-close-popup">Close</button>
      </div>
    </div>
  );
};

export default LoginPromptPopup;
