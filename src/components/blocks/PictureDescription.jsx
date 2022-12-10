import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

import { Box, Card, FormControl, IconButton } from '@mui/material'
import ImageUploader from '../common/ImageUploader'

import { CameraAlt, Delete } from '@mui/icons-material'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { StyledInputBase } from '../common/StyledComponents'
import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service'
import { v1 as uuid } from 'uuid'

const IMAGE_ASPECT_RATIO = 4 / 1;

const PictureDescription = ({
  form: { setValue, getValues, register, watch } },
  ref) => {
  const [imageToDelete, setImageToDelete] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [initialValue, setInitialValue] = useState(null);

  const imageKey = watch('data.image');

  const getBlockData = async (formData) => {

    const payload = { ...formData }
    let imageKey = null;
    if (formData?.data?.imageFile) {
      imageKey = await uploadImage(formData.data.imageFile)
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

  useEffect(() => {
    let mounted = true;
    if (mounted && imageKey) {
      setImageUrl(getImageSrc(imageKey))
    }
    return () => mounted = false;
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{
        width: 'fit-content',
        position: 'relative',
        overflow: 'visible',
        borderRadius: '5px',
        height: '200px',
        maxWidth: '80%',
        aspectRatio: `${IMAGE_ASPECT_RATIO}`
      }}>
        {imageUrl
          ? (<>
            <IconButton size='small' onClick={() => {
              setImageToDelete(imageUrl);
              setValue('data.imageFile', null)
              setValue('data.image', null)
              setImageUrl(null);
            }
            } sx={{ position: 'absolute', top: -17, right: -17, bgcolor: 'white', "&:hover": { bgcolor: '#dedede' } }}>
              <Delete sx={{ color: 'red' }} />
            </IconButton>
            <img
              src={imageUrl ?? null}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '5px'
              }}
            />
          </>)
          : (
            <div
              style={{
                width: '100%',
                height: '100%',
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
          id={`picture-description-${uuid()}`}
          ratio={IMAGE_ASPECT_RATIO}
          onChange={async (file) => {
            setImageToDelete(imageUrl)
            setValue('data.imageFile', file)
            const src = await getSrcFromFile(file)
            setImageUrl(src);

          }}
        />
      </Box>
      <FormControl sx={{ pt: 3 }} variant="standard" fullWidth >
        <StyledInputBase placeholder='Підпис до зображення' id='description-input' {...register('data.description', { maxLength: 100 })} />
      </FormControl>
    </Box>
  )
}

export default forwardRef(PictureDescription);