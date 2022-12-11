import React from 'react'
import { InputAdornment, TextField } from '@mui/material'

const AdornmentTextField = (props) => (
  <TextField
    id={props?.id ?? 'adornment-input'}
    sx={(theme) => ({
      backgroundColor: '#fcfcfb',
      width: '100%',
      'label + &': {
        marginTop: 3,
      },
      '& fieldset': {
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '100%',
        transition: theme.transitions.create([
          'border-color',
          'background-color',
          'box-shadow',
        ]),
        '&:hover': {
          border: '1px solid #ced4da'
        },
      },
      '& .Mui-focused': {
        '& fieldset': {
          boxShadow: `#1a2e2240 0 0 0 0.2rem !important`,
          border: '1px solid var(--theme-color) !important',
        }
      },
      '& .MuiInputBase-root': {
        padding: '9px 14px 9px 9px',
        fontSize: '16px',
        '& input': {
          padding: '0 !important'
        },
      }
    })}
    InputProps={{
      startAdornment: (
        <InputAdornment
          position="start"
          sx={{
            padding: '0 10px',
            bgcolor: '#cccccc80',
            height: '100%',
            borderRadius: 1,
            color: 'var(--theme-color)'
          }}
        >
          {props.adornmentText}
        </InputAdornment>)
    }}
    {...props}
  />
)

export default AdornmentTextField