import React, { useState } from 'react'
import { Alert, Button, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CancelButton } from '../common/StyledComponents';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BlockModal = ({ open, onClose, allowedBlocks, appendBlock, blocksLength }) => {
  const [newBlock, setNewBlock] = useState(0);

  const onAdd = (newBlock) => {
    if (newBlock) {
      try {
        appendBlock({
          block: {
            is_published: true,
            position: blocksLength,
            type: newBlock,
            data: {},
            offers: null,
            projects: null,
            services: null
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(2px)'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          maxWidth: '90%',
          boxShadow: 24,
          pt: 5,
          px: 4,
          pb: 5,
          bgcolor: 'white',
          borderRadius: '8px',
        }}>
        <Typography fontSize={20} mb={2} fontWeight={500}>
          Додайте новий блок
        </Typography>
        <Alert severity='info' sx={{ mb: 2 }}>
          Виберіть блок нижче щоб додати його
        </Alert>
        {allowedBlocks.map(b => (
          <Box key={b.label} sx={{ m: 1, width: '100%', '& .MuiButton-root': { width: '100%' } }}>
            <Button
              style={{
                textTransform: 'none',
                color: 'var(--theme-color)',
                borderRightColor: 'var(--menu-active-button-color)'
              }} onClick={() => {
                onAdd(b.type)
                onClose();
              }}>
              <Typography sx={{ flexGrow: 1 }}>
                {b.label}
              </Typography>
              <ArrowBackIcon style={{
                flexBasis: '20%',
                color: 'var(--theme-color)',
                fontSize: '16px',
                marginRight: 16
              }} />
            </Button>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3, gap: '25px' }}>
          <CancelButton onClick={() => {
            onClose()
          }}>
            Скасувати
          </CancelButton>
        </Box>
      </Box>
    </Modal>
  )
}

export default BlockModal