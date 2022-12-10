import React, { useState, useImperativeHandle } from 'react'

import { Box, Card, FormControl, IconButton } from '@mui/material'
import ImageUploader from '../common/ImageUploader'

import { CameraAlt, Delete } from '@mui/icons-material'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { StyledInputBase } from '../common/StyledComponents'
import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service'

const IMAGE_ASPECT_RATIO = 16 / 9;

const PictureDescription = ({
  form: { setValue, getValues, register, setValue, watch, trigger } },
  ref) => {
  const [imageToDelete, setImageToDelete] = useState(null);
  const imageUrl = watch('data.imageUrl');
  const [initialValue, setInitialValue] = useState(null);

  const getBlockData = async (formData) => {
    const errors = await trigger();

    const payload = { ...formData }
    let imageKey = null;
    if (formData?.data?.file) {
      imageKey = await uploadImage(formData.data.file)
      await deleteImage(imageToDelete)

      setValue('data.image', getImageSrc(imageKey));
      setValue('data.imageFile', null);

      delete payload.data.imageFile;
      payload.data.image = imageKey;
    }

    if (JSON.stringify(payload) != JSON.stringify(initialValue)) {
      setInitialValue(payload);

      return payload;
    }
    return null;
  }

  useImperativeHandle(ref, () => ({ getBlockData: async () => await getBlockData(getValues()) }))

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
        <StyledInputBase placeholder='Опис до зображення' id='description-input' {...register('data.description', { maxLength: 100 })} />
      </FormControl>
    </Box>
  )
}

export default PictureDescription