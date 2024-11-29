import React from 'react'
import Sidebar from './partials/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="admin-page__container">
                <Outlet />
            </div>
        </>
    )
}

export default AdminLayout