import React, { useState } from 'react'
import { Alert, Button, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CancelButton } from '../common/StyledComponents';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddButton from '../common/AddButton';
import SaveButton from '../common/SaveButton';
import { dataTypes } from '../../services/data-types-service';
import { blocks } from '../blocks';

const BlockModal = ({ allowedBlocks, appendBlock, blocksLength, isMainPage = false }) => {
  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false)

  const onAdd = (newBlockType) => {
    if (newBlockType) {
      try {
        const newBlock = {
          is_published: false,
          position: blocksLength,
          type: newBlockType,
          data: {},
          offers: null,
          projects: null,
          services: null,
        }
        if (isMainPage) {
          dataTypes.forEach(type => {
            newBlock[type] = []
            newBlock[`${type}_ids`] = []
          })
        }
        appendBlock(newBlock)
      } catch (error) {
        console.error(error)
      }
    }
    onClose();
  }

  return (
    <>
      <Box sx={{
        px: 2,
        pb: 3
      }}>

        <AddButton
          label='Додати блок'
          onClick={() => setOpen(true)}
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            border: `1px dashed #2e7d3290`,
            borderRadius: '5px',
            overflow: 'hidden',
            height: 60,
            textTransform: 'none'
          }}
        />
      </Box>
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
          {allowedBlocks.map(blockType => {
            const b = blocks.find(block => block.type == blockType)
            return (
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
            )
          })}
          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3, gap: '25px' }}>
            <CancelButton onClick={() => {
              onClose()
            }}>
              Скасувати
            </CancelButton>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default BlockModal