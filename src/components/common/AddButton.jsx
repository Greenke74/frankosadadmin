import React from 'react'

import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

const AddButton = (props) => {
  return (
    <Button
      startIcon={<AddIcon />}
      variant='text'
      color='success'
      sx={{
        padding: '6px 15px !important',
        textTransform: 'none'
      }}
      {...props}
    >
      {props.label}
    </Button>
  )
}

export default AddButton