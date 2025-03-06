import React, { useState } from 'react';
import './InventoryCard.css';
import InventoryAdd from '../InventoryFunction/InventoryAdd';
import SendInventory from '../SendInventory/SendInventory';
import { IoIosSend, IoMdAddCircle } from 'react-icons/io';

const InventoryCard = ({ id, name, price, category, quantity, image, invid, branch }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(quantity); // Local state for quantity

  const handleEditClick = () => setShowEditPopup(true);
  const handleSendClick = () => setShowSendPopup(true);

  const handleCloseEditPopup = () => setShowEditPopup(false);
  const handleCloseSendPopup = () => setShowSendPopup(false);

  // Handle the updated quantity from InventoryAdd
  const handleSave = (updatedInventory) => {
    setCurrentQuantity(updatedInventory.quantity); // Update the quantity state
  };

  const handleConfirmSend = async (quantityToSend) => {
    console.log('Sending Product ID:', id);
    console.log('Sending Inventory ID:', invid);
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/send-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          invid: invid,
          quantityToSend: parseInt(quantityToSend, 10),
          branch: branch,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inventory sent successfully:', data);
        alert('Inventory sent successfully!');
        handleCloseSendPopup();
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

  // Determine the background color based on quantity
  // Determine the background color based on quantity
  const cardStyle = {
    backgroundColor:
      currentQuantity === 0
        ? '#ff9999'
        : currentQuantity >= 1 && currentQuantity < 6
          ? '#ffff99'
          : 'white',
  };

  return (
    <div className="ad-inv-item-food-card" style={cardStyle}>
      <div className="ad-inv-item-food-card-info">
        <div className="ad-inv-item-food-card-name-rating">
          <p>{name}</p>
        </div>
      </div>
      <div className="edit-delete-container">
        <p>{currentQuantity} pcs</p>
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
          quantity={currentQuantity}
          invid={invid}
          onClose={handleCloseEditPopup}
          onSave={handleSave} // Pass the onSave callback to update the parent
          name={name}
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
