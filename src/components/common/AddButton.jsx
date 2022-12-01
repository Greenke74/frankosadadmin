import React from 'react'

import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

const AddButton = ({ label, onClick }) => {
  return (
    <Button
      startIcon={<AddIcon />}
      variant='text'
      color='success'
      sx={{
        padding: '6px 15px !important',
        textTransform: 'none'
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export default AddButton