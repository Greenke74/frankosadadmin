import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { SuccessButton } from './StyledComponents'

const PageHeader = ({
  title,
  onSubmit,
  submitLabel = 'Зберегти',
  submitDisabled
}) => {
  return (
    <header style={{
      width: '100%',
      height: '60px',
      backgroundColor: '#283c30',
      fontWeight: '600',
      color: 'var(--white)',
      boxShadow: '0px 2px 24px rgb(0 0 25 / 15%)',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }}>
      <Box sx={{
        height: '100%',
        maxWidth: '1200px',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography sx={{
          textTransform: 'uppercase',
          fontSize: '20px',
          fontWeight: 500,
        }}>
          {title ?? ''}
        </Typography>
        {onSubmit && (
          <Button disabled={submitDisabled} sx={{ textTransform: 'none', bgcolor: 'var(--white)', padding: '4px 20px', color: 'var(--theme-color)', '&:hover': { bgcolor: '#90a297', color: 'white' } }} onClick={onSubmit}>{submitLabel}</Button>
        )}
      </Box>
    </header>
  )
}

export default PageHeader