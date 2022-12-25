import { Box } from '@mui/material'
import React from 'react'

const TabPanel = ({ children }) => {
  return (
    <Box
      sx={{
        flex: '1 0 100%',
        pt: 1,
        px: '5px'
      }}
    >
      {children}
    </Box>
  )
}

export default TabPanel