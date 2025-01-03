import React from 'react'
import './ProductCategory.css'
import { menu_list } from '../../../../assets/assets'

const ProductCategory = ({category,setCategory}) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <p className="explore-menu-text">{/*Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor*/}</p>
      <div className="explore-menu-list">
        {menu_list.map((item,index)=> {
          return (
            <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}key={index} className='explore-menu-list-item'> 
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

export default ProductCategory
