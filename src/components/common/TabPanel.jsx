import { Box, Slide } from '@mui/material'
import React from 'react'

const TabPanel = ({ children, index, currentTab }) => {
  return (
    <Slide in={index == currentTab} >
      <Box
        sx={{
          flex: '1 0 100%',
          pt: 1,
          px: '5px',
        }}
      >
        {children}
      </Box>
    </Slide>
  )
}

export default TabPanel