import React, { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { InputLabel, Button } from '@mui/material';
import { LinearProgress } from '@mui/material';



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
    color: 'var(--white ) !important',
    backgroundColor: 'var(--active-color) !important',
    textTransform: 'none',
    padding: '6px 20px',
  },
  '&.Mui-disabled': {
    backgroundColor: 'var(--disabled-color) !important',
  }

})

export const StyledLinearProgress = styled(LinearProgress)({
  '&': {
    backgroundColor: 'var(--disabled-color)',
    marginLeft: '-1.5rem'
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'var(--theme-color)'
  }
})



