import { useState } from 'react'
import './App.css'
import Layout from './Layout'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Cart from './components/User/Cart'
import Orders from './components/User/Orders'

import ProductForm from './components/Product/ProductForm'
import ProductEdit from './components/Product/ProductEdit'

import Sidebar from './partials/Sidebar'

import { Routes, Route } from 'react-router-dom'

import { AuthProvider } from './auth/AuthContext'
import axios from 'axios'
import Register from './components/Register'


function App() {
  axios.defaults.withCredentials = true;

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        <Route path="/admin" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/product/add" element={<ProductForm />} />
          <Route path="/admin/product/:id" element={<ProductEdit />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </AuthProvider>

  )
}

export default App
