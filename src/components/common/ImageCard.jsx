import React from 'react'
import { Card, Box } from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import ImageDeleteButton from './ImageDeleteButton'

const ImageCard = ({ src, ratio, error, onClickDelete, customDivideBy }) => {
  const divideBy = customDivideBy
    ? customDivideBy
    : ratio > 3
      ? 8
      : 6
  return (
    <Box sx={{ position: 'relative' }}>
      {onClickDelete && src && (<ImageDeleteButton onClick={onClickDelete} />)}
      <Card
        sx={{
          boxShadow: error ? '0px 0px 3px 0px red' : undefined,
          width: `calc(100vw / ${divideBy} * ${ratio}) !important`,
          height: `calc(100vw / ${divideBy}) !important`,
          display: 'flex'
        }}
      >
        {Boolean(src)
          ? (<>
            <img style={{ width: '100%' }} src={src} />
          </>)
          : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <CameraAlt sx={{ fontSize: 36, color: '#dedede' }} />
            </Box>
          )}
      </Card>
    </Box>
  )
}

export default ImageCard