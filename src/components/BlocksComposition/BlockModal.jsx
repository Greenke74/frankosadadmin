import React, { useState } from 'react'
import { Alert, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CancelButton, SuccessButton } from '../common/StyledComponents';

const BlockModal = ({ open, onClose, allowedBlocks, appendBlock, blocksLength }) => {
  const [newBlock, setNewBlock] = useState(0);

  const onAdd = () => {
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
        setNewBlock(0);
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
          width: 800,
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
        <FormControl fullWidth >
          <InputLabel shrink htmlFor="blockSelect">
            Новий блок
          </InputLabel>
          <Select
            fullWidth
            id='blockSelect'
            label='Новий блок'
            value={newBlock}
            onChange={(e) => setNewBlock(e.target.value)}
          >
            {allowedBlocks.map(b => (
              <MenuItem key={b.type} value={b.type}>{b.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3, gap: '25px' }}>
          <CancelButton onClick={() => {
            setNewBlock(0);
            onClose()
          }}>
            Скасувати
          </CancelButton>
          <SuccessButton onClick={onAdd}>
            Додати
          </SuccessButton>
        </Box>
      </Box>
    </Modal>
  )
}

export default BlockModal