import React, { useEffect, useState } from 'react'
import '../../styles/Cart.css'
import axiosInstance from '../../utils/AxiosInstance'
import { useAuth } from '../../auth/AuthContext';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState([])
  const retrieve = async () => {
    try {
      const res = await axiosInstance.get(`api/user/${user._id}`)
      setCart(res.data.data.cart)
      console.log(res.data.data.cart)
    } catch (error) {
      console.log(error)
    }
  }

  const checkout = async() => {
    const formData = {
      "userId": user._id,
      "shippingDetails": "Dine In.",
    }
    try {
      const res = await axiosInstance.post(`/api/user/checkout`, formData)
      console.log(res)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    retrieve()
  }, [])
  return (
    <div className="cart-container">
      <div className="cart-header">
        <div></div>
        <div>Image</div>
        <div>Details</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Subtotal</div>
      </div>
      <div className="cart-list">
        {
          cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="checkbox"><input type="checkbox" /></div>
                <div className="image-container"></div>
                <div className="product-details">{item.productId.title}</div>
                <div className="price">$ {item.productId.price}</div>
                <div className="quantity">{item.quantity}</div>
                <div className="subtotal">$ {item.quantity * item.productId.price}</div>
              </div>
            ))
          ) : (
            <div className='full-width'>No Products added to cart.</div>
          )
        }
      </div>
      <div className="cart-controls">
        <button onClick={() => {checkout()}}>Proceed to Checkout</button>
      </div>
    </div>
  )
}

export default Cart