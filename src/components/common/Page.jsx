import { Box } from '@mui/material'
import React from 'react'

const Page = ({ children }) => {
  return (
    <Box sx={{m: 2, borderRadius: '5px', bgcolor: '#fff', maxWidth: 1200}}>{children}</Box>
  )
}

export default Page