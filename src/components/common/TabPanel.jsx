import { Box } from '@mui/material'
import React from 'react'

const TabPanel = ({ children, index }) => {
  return (
    <Box
      sx={{
        flex: '1 0 100%',
        pt: 1,
        px: '5px',
        zIndex: index ?? 1
      }}
    >
      {children}
    </Box>
  )
}

export default TabPanel