import React, { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { InputLabel, Button, Checkbox } from '@mui/material';
import { CircularProgress, LinearProgress } from '@mui/material';



export const StyledInputBase = styled(InputBase)(({ theme, error }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#fcfcfb',
    border: error ? '1px solid red' : '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '8px 14px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${error ? '#ff00003b' : '#1a2e2240'} 0 0 0 0.2rem`,
      borderColor: error ? 'red' : 'var(--theme-color)',
    }
  },
}));

export const StyledInputLabel = styled(InputLabel)({
  '&.Mui-focused': {
    color: 'var(--theme-color) !important'
  }
})

export const SuccessButton = styled(Button)({
  '&': {
    color: 'var(--white )',
    backgroundColor: 'var(--active-color)',
    textTransform: 'none',
    padding: '6px 20px',
  },
  '&:hover': {
    backgroundColor: '#62b784'
  },
  '&.Mui-disabled': {
    backgroundColor: 'var(--disabled-color)',
    color: 'var(--white )'
  }
})

export const CancelButton = styled(Button)({
  '&': {
    color: '#6d6d6d',
    backgroundColor: '#dedede',
    textTransform: 'none',
    padding: '6px 20px',
  },
  '&:hover': {
    backgroundColor: '#cbcbcb'
  },
  '&.Mui-disabled': {
    backgroundColor: 'var(--disabled-color)',
    color: 'var(--white )'
  }
})

export const StyledLinearProgress = styled(LinearProgress)({
  '&': {
    backgroundColor: 'var(--disabled-color)',
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'var(--theme-color)'
  }
})

export const StyledCheckbox = styled(Checkbox)({
  '&': {
    color: 'var(--theme-color)'
  },
  '&.Mui-checked': {
    color: 'var(--theme-color)'
  }
})

export const Spinner = ({ style }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '25px 0', ...style }}>
      <CircularProgress size={30} style={{ color: 'var(--theme-color)' }} />
    </div>
  )
}

export const CommonButton = styled(Button)({
  '&': {
    color: 'var(--theme-color)',
    backgroundColor: 'white',
    textTransform: 'none',
    padding: '6px 20px',
  },
  '&:hover': {
    backgroundColor: '#dedede'
  },
  '&.Mui-disabled': {
    backgroundColor: '#f7eeee',
  }
})




