import React, { useState } from 'react';
import './InventoryCard.css';
import InventoryAdd from '../InventoryFunction/InventoryAdd';
import SendInventory from '../SendInventory/SendInventory';
import { IoIosSend, IoMdAddCircle } from 'react-icons/io';

const InventoryCard = ({ id, name, price, category, quantity, image, invid, branch }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSendPopup, setShowSendPopup] = useState(false);

  const handleEditClick = () => setShowEditPopup(true);
  const handleSendClick = () => setShowSendPopup(true);

  const handleCloseEditPopup = () => setShowEditPopup(false);
  const handleCloseSendPopup = () => setShowSendPopup(false);

  const handleConfirmSend = async (quantityToSend) => {
    console.log('Sending Product ID:', id); // Debugging to ensure ID exists
    console.log('Sending Inventory ID:', invid); // Debugging to ensure inventory ID exists
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/send-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id, // Ensure this matches the backend
          invid: invid, // Ensure this matches the backend
          quantityToSend: parseInt(quantityToSend, 10),
          branch: branch, // Current branch
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inventory sent successfully:', data);
        alert('Inventory sent successfully!');
        handleCloseSendPopup(); // Close the popup
      } else {
        const errorData = await response.json();
        console.error('Failed to send inventory:', errorData);
        alert(`Failed to send inventory: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending inventory:', error);
      alert('An error occurred while sending inventory.');
    }
  };

  return (
    <div className="ad-inv-item-food-card">
      <div className="ad-inv-item-food-card-img-container">
        <img className="ad-inv-item-food-card-image" src={image} alt={name} />
      </div>
      <div className="ad-inv-item-food-card-info">
        <div className="ad-inv-item-food-card-name-rating">
          <p>{name}</p>
        </div>
      </div>
      <div className="edit-delete-container">
        <p>{quantity} pcs</p>
        <div className="ad-inv-buttons">
          <button className="ad-inv-item-btn-cart" onClick={handleEditClick}>
            <IoMdAddCircle size={25} />
          </button>
          <button className="ad-inv-item-btn-cart" onClick={handleSendClick}>
            <IoIosSend size={25} />
          </button>
        </div>
      </div>
      {showEditPopup && (
        <InventoryAdd
          productId={id}
          name={name}
          quantity={quantity}
          invid={invid}
          onClose={handleCloseEditPopup}
        />
      )}
      {showSendPopup && (
        <SendInventory
          itemName={name}
          invid={invid}
          branch={branch}
          productId={id}
          onConfirm={(quantityToSend) => handleConfirmSend(quantityToSend)}
          onCancel={handleCloseSendPopup}
        />
      )}
    </div>
  );
};

export default InventoryCard;
