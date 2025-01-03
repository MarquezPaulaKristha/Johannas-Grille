import React from 'react'
import './CustomerTermsCondition.css'

const CustomerTermsCondition = ({ onClose }) => (
    <div className="terms-modal-overlay">
      <div className="terms-modal-content">
        <button className="terms-close-button" onClick={onClose}>Close</button>
        <h2>Terms and Conditions</h2>
        <ol>
          <li>
            <strong>Introduction</strong>
            <p>Welcome to [Your Restaurant Name]. We strive to provide our guests with exceptional dining experiences. By making a reservation or purchasing food and beverages from our establishment, you agree to abide by the following terms and conditions regarding our No Return and No Refund policy. Please read these terms carefully.</p><br />
          </li>
          <li>
            <strong>No Return Policy</strong>
            <p>All sales of food and beverages are final. Once an order is placed and accepted, we do not accept any returns for any reason. This policy applies to:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>Dine-in meals</li>
              <li>Take-out orders</li>
              <li>Catering services</li><br />
            </ul>
          </li>
          <li>
            <strong>No Refund Policy</strong>
            <p>Due to the nature of our business, we do not issue refunds for any orders placed. This includes, but is not limited to:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>Mistakes made in ordering (e.g., incorrect menu items)</li>
              <li>Disappointment with the food or service</li>
              <li>Changes in personal circumstances that affect your ability to dine with us</li><br />
            </ul>
          </li>
          <li>
            <strong>Exceptions</strong>
            <p>While our policy is strictly "No Returns" and "No Refunds," we recognize that certain situations may arise. The following exceptions may apply:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>If a meal is found to be defective or unsafe (e.g., containing foreign objects or not prepared as specified), please notify a staff member immediately during your visit. We will assess the situation and may offer a replacement or resolution.</li>
              <li>If you have a food allergy or dietary restriction that was not properly communicated or acknowledged at the time of ordering, please inform our staff as soon as possible so we can address your concerns.</li><br />
            </ul>
          </li>
          <li>
            <strong>Customer Responsibility</strong>
            <p>It is the customer's responsibility to review menu items, ingredients, and any special requests before placing an order. We encourage guests to ask questions or seek clarification regarding menu items to avoid any misunderstandings.</p><br />
          </li>
          <li>
            <strong>Acceptance of Terms</strong>
            <p>By placing an order or making a reservation at [Your Restaurant Name], you acknowledge that you have read and understood these Terms and Conditions and agree to abide by our No Return and No Refund policy. If you do not agree with these terms, please refrain from placing an order.</p><br />
          </li>
          <li>
            <strong>Contact Us</strong>
            <p>If you have any questions or concerns regarding these Terms and Conditions, please contact us at:</p>
            <div className="contact-info">
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li><strong>Email:</strong> [Your Email Address]</li>
                <li><strong>Phone:</strong> [Your Phone Number]</li>
                <li><strong>Address:</strong> [Your Restaurant Address]</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );

export default CustomerTermsCondition
