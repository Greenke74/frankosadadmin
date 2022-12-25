import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { SuccessButton } from './StyledComponents'

const PageHeader = ({
  title,
  onSubmit,
  submitLabel = 'Зберегти',
  submitDisabled,
  onGoBack
}) => {
  return (
    <header style={{
      width: '100%',
      height: '60px',
      backgroundColor: 'var(--white)',
      fontWeight: '600',
      color: 'var(--theme-color)',
      boxShadow: '0px 2px 24px rgb(0 0 25 / 15%)',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      borderBottom: '1px solid #1a2e229e'
    }}>
      <Box sx={{
        height: '100%',
        maxWidth: '1200px',
        mx: 2,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Typography sx={{
          fontSize: '20px',
          fontWeight: 500,
          textShadow: '0px 0px 11px rgb(60 113 47 / 70%)',
          flex: '1 0 auto'
        }}>
          {title ?? ''}
        </Typography>
        {onGoBack && (
          <Button
            onClick={onGoBack}
            sx={{
              textTransform: 'none',
              bgcolor: 'var(--white)',
              padding: '4px 20px',
              color: 'var(--theme-color)',
              '&:hover': {
                bgcolor: '#fff'
              }
            }}
          >Повернутися
          </Button>
        )}
        {onSubmit && (
          <Button disabled={submitDisabled} sx={{ textTransform: 'none', bgcolor: 'var(--theme-color)', padding: '4px 20px', color: 'var(--white)', '&:hover': { bgcolor: '#2c4c39' } }} onClick={onSubmit}>{submitLabel}</Button>
        )}

      </Box>
    </header>
  )
}

export default PageHeader