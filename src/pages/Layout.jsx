import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      This is the default Layout
      <Outlet/>
    </div>
  )
}

export default Layout
