import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

import { Box, Card, Grid, IconButton } from '@mui/material'
import ImageUploader from '../common/ImageUploader'
import { StyledInputBase } from '../common/StyledComponents';

import { CameraAlt, Delete } from '@mui/icons-material'

import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';
import { v1 as uuid } from 'uuid'
import { getSrcFromFile } from '../../helpers/file-helpers';

const IMAGE_ASPECT_RATIO = 3 / 1;

const PictureParagraph = ({ form: { setValue, getValues, watch, register, trigger, formState: { errors } } }, ref) => {
  const [imageToDelete, setImageToDelete] = useState(null);
  const [initialValue, setInitialValue] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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

  useEffect(() => {
    let mounted = true;
    if (mounted && imageKey) {
      setImageUrl(getImageSrc(imageKey))
    }
    return () => mounted = false;
  }, [])

  useImperativeHandle(ref, () => ({ getBlockData: async () => await getBlockData(getValues()) }))

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StyledInputBase
          multiline={true}
          sx={{ width: '100%' }}
          minRows={7}
          maxRows={15}
          placeholder='Текст'
          {...register('data.paragraph', { required: true, maxLength: 2000 })}
        />
        {errors && errors?.data?.paragraph && (
          <ErrorMessage
            type={errors?.data?.paragraph?.type}
            maxLength={errors?.data?.paragraph?.type == 'maxLength' ? 2000 : null} />
        )}
      </Grid>
      <Grid item xs={6}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Card
            sx={{
              maxHeight: '150px',
              height: 'fit-content',
              maxWidth: '100%',
              position: 'relative',
              overflow: 'visible',
              aspectRatio: `${IMAGE_ASPECT_RATIO}`,
              borderRadius: '5px',
              mb: 3
            }}>
            {imageUrl
              ? (<>
                <IconButton
                  size='small'
                  onClick={() => {
                    setValue('data.imageFile', null);
                    setValue('data.image', null);
                    setImageUrl(null);
                  }}
                  sx={{
                    position: 'absolute',
                    top: -17,
                    right: -17,
                    bgcolor: 'white',
                    "&:hover": { bgcolor: '#dedede' }
                  }}>
                  <Delete sx={{ color: 'red' }} />
                </IconButton>
                <img
                  src={imageUrl}
                  style={{
                    width: '100%',
                    borderRadius: '5px',
                    aspectRatio: `${IMAGE_ASPECT_RATIO}`
                  }} />
              </>)
              : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} >
                  <CameraAlt sx={{ fontSize: 36, color: '#dedede' }} />
                </Box>
              )}
          </Card>
          <Box>
            <ImageUploader
              id={`picture-paragraph-${uuid()}`}
              ratio={IMAGE_ASPECT_RATIO}
              onChange={async (file) => {
                setImageToDelete(imageUrl);
                setValue('data.imageFile', file);
                const src = await getSrcFromFile(file)
                setImageUrl(src)
              }}
            />
          </Box>
        </Box>
      </Grid>

    </Grid>
  )
}

export default forwardRef(PictureParagraph);