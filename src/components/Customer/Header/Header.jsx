import React from 'react'
import './Header.css'

const Header = () => {

  return (
    <div>
      <div className="header">
        <div className="header-contents">
            <h2>Order your favorite food here</h2>
            <p>{/*lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor */}</p>
            <a href='#explore-menu'><button>View Menu</button></a>
        </div>
      </div>
    </div>
  )
}

export default Header
