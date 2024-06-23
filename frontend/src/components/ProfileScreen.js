import React from "react";
import './ProfileScreen.css'
import { ReactComponent as HeadOfMedusaIcon } from './../assets/head_of_medusa.svg';

const ProfileScreen = ({ show, onClose, items }) => {
  if (!show) return null;

  return (
    <div className={`profile-screen show`}>
      <div className="profile-content">
        <h2>
        <button className="close-button" onClick={() => onClose(false)}>
            <i className="fas fa-times"></i>
          </button>
          User Profile
        </h2>
        <div className="profile-items">
          <h3>Items</h3>
          <div className="item-list">
            {items.map((item, index) => (
              <div key={index} className={`item ${item.obtained ? '' : 'greyed-out'}`}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p><em>{item.obtained ? 'Equipped' : `Obtain by: ${item.obtainCondition}`}</em></p>
                <div className="item-icon">
                  {item.name === "Head of Medusa" && (
                    <HeadOfMedusaIcon />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;