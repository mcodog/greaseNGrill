import React from 'react'
import Header from './partials/Header'
import { Outlet } from 'react-router-dom'
import './styles/Common.css'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="page-container">
        <Outlet />
      </div>
    </>
  )
}

export default Layout