import React from 'react'
import { Stack } from '@mui/material'
import SidebarButton from './SidebarButton'

import { getRoutes } from '../../../services/routes-service'

const Sidebar = () => {
  return (
    <Stack className='h-100 py-3' style={{
      backgroundColor: 'var(--theme-color)'
    }}>
      {getRoutes().map(r => (
        <SidebarButton key={r.path} to={r.path} label={r.label} />
      ))}
    </Stack>
  )
}

export default Sidebar