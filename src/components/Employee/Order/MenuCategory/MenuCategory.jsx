import React from 'react'
import './MenuCategory.css'
import { menu_list } from '../../../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className="emp-explore-menu" id="explore-menu">
      <p className="emp-explore-menu-text">{/*Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor*/}</p>
      <div className="emp-explore-menu-list">
        {menu_list.map((item,index)=> {
          return (
            <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}key={index} className='emp-explore-menu-list-item'> 
              <img className={category===item.menu_name?"active":""}src={item.menu_image} alt=''/>
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      < hr/>
    </div>
  )
}

export default ExploreMenu
