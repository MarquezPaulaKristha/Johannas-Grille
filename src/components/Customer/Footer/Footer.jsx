import React from 'react'
import './Footer.css'
import { assets } from '../../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Social Media's</p>
          <div className="footer-social-icons">
            {/* Add a link around the Facebook icon */}
            <a href="https://www.facebook.com/profile.php?id=100046471076383&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
              <img src={assets.fb_icon} alt="Facebook" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>(043)727-1304</li>
            <li>09532159027</li>
            <li>johannasgrille@yahoo.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 @ Johanna's Grille.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer