import React from 'react'
import { Box, Button, Popover, Typography, Tooltip } from '@mui/material';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getImageSrc } from '../../services/storage-service';

const OptionsPicker = ({
  id,
  open,
  anchorEl,
  options,
  onAdd,
  onClose,
  dataType
}) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        width: '100%',
        justifyContent: 'space-between'
      }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Виберіть {dataType == 'projects' ? 'проєкт' : dataType == 'services' ? 'послугу' : 'сезонну пропозицію'}
        </Typography>
        <Button
          color='error'
          onClick={() => onClose()}
        >
          <Tooltip title={'Закртии'}>
            <HighlightOffIcon />
          </Tooltip>
        </Button>
      </Box>
      <Box
        maxHeight={350}
        display='flex'
        flexDirection='column'
        padding={2}
        style={{
          gap: 10,
          overflowY: 'auto'
        }}
      >
        {options
          .map((o) => (
            <Button
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                textTransform: 'none',
                color: 'var(--theme-color)',
                gap: 1,
                p: 1,
                border: '1px solid #BABABA',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: '0.3s background-color ease-in-out',
                '&:hover': {
                  bgcolor: '#DFF5E8'
                },
                minWidth: '250px'
              }}
              onClick={() => onAdd(o)}
            >
              {o.image && (<img style={{ maxWidth: '120px', borderRadius: 3, zIndex: 1 }} src={getImageSrc(o.image)} />)}
              <Typography sx={{ fontWeight: 500, pr: 1 }}>{o.title ?? o.name ?? o.label}</Typography>
            </Button>
          ))}
      </Box>
    </Popover>
  )
}

export default OptionsPicker