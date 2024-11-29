import React from 'react'
import '../styles/Header.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext';
import axiosInstance from '../utils/AxiosInstance';
import logo from '../assets/logo.jpg'

const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const logout = async() => {
    try {
      const res = await axiosInstance.get(`/api/auth/logout`)
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = `${cookie.split("=")[0].trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });
      console.log(res)
    } catch(e) {
      console.log(e)
    }
    
    window.location.href = "/login";
  };

  return (
    <header className='custom-header'>
      <nav className='custom-nav'>
        <div className="main-nav">
          <Link to="/">
            <div className="logo-container">
              <img src={logo} alt="main-logo" />
            </div>
          </Link>
        </div>
        <div className="main-navigation">
          <Link to="/">Home</Link>
          {
            isAuthenticated ? (
              <Link to="/admin">Products</Link>
            ) : (
              null
            )
          }

          {
            isAuthenticated ? (
              <Link to="/cart">Cart</Link>
            ) : (
              null
            )
          }

{
            isAuthenticated ? (
              <Link to="/orders">Orders</Link>
            ) : (
              null
            )
          }

          {
            isAuthenticated ? (
              <Link onClick={() => {logout()}}>Logout</Link>
            ) : (
              <Link to="/login">Login</Link>
            )
          }
        </div>
      </nav>
    </header>
  )
}

export default Header