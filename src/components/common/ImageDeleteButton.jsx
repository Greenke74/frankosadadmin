import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Delete } from '@mui/icons-material'

const ImageDeleteButton = ({ onClick }) => (
  <Tooltip title='Видалити зображення'>
    <IconButton
      size='small'
      sx={{
        position: 'absolute',
        top: -18,
        right: -18,
        bgcolor: 'white',
        '&:hover': {
          bgcolor: '#f7eeee'
        }
      }}
      onClick={onClick}
    >
      <Delete sx={{ color: 'var(--error)' }} />
    </IconButton>
  </Tooltip>
)

export default ImageDeleteButton