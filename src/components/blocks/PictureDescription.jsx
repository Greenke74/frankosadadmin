import { CameraAlt, Delete } from '@mui/icons-material'
import { Card, FormControl, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { Box } from '@mui/system'
import ImageUploader from '../common/ImageUploader'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { StyledInputBase } from '../common/StyledComponents'

const IMAGE_ASPECT_RATIO = 16 / 9;

const PictureDescription = ({ form }) => {
  const { register, setValue, watch } = form;
  const [imageToDelete, setImageToDelete] = useState(null);
  const imageUrl = watch('data.imageUrl');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: 'fit-content', position: 'relative', overflow: 'visible', borderRadius: '5px' }}>
        {imageUrl
          ? (<>
            <IconButton size='small' onClick={() => {
              setImageToDelete(imageUrl);
              setValue('data.imageFile', null)
              setValue('data.imageUrl', null)
            }
            } sx={{ position: 'absolute', top: -17, right: -17, bgcolor: 'white', "&:hover": { bgcolor: '#dedede' } }}>
              <Delete sx={{ color: 'red' }} />
            </IconButton>
            <img
              src={imageUrl ?? null}
              style={{
                maxWidth: '50vw',
                objectFit: 'cover',
                aspectRatio: IMAGE_ASPECT_RATIO,
                width: '400px',
                borderRadius: '5px'
              }}
            />
          </>)
          : (
            <div
              style={{
                maxWidth: '50vw',
                width: '400px',
                aspectRatio: IMAGE_ASPECT_RATIO,
                backgroundColor: '#f7eeee',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CameraAlt sx={{ fontSize: 36, color: '#dedede' }} />
            </div>
          )}
      </Card>
      <Box paddingTop={2} >
        <ImageUploader
          ratio={IMAGE_ASPECT_RATIO}
          onChange={async (file) => {
            setValue('data.imageFile', file)
            setValue('data.imageUrl', await getSrcFromFile(file))
          }}
        />
      </Box>
      <FormControl sx={{ pt: 3 }} variant="standard" fullWidth >
        <StyledInputBase placeholder='Опис до зображення' id='description-input' {...register('data.description', { maxLength: 100 })}  />
      </FormControl>
    </Box>
  )
}

export default PictureDescription