import React, { useState, useImperativeHandle } from 'react'

import { Card, Grid, IconButton } from '@mui/material'
import ImageUploader from '../common/ImageUploader'
import { StyledInputBase } from '../common/StyledComponents';

import { CameraAlt, Delete } from '@mui/icons-material'

import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';

const IMAGE_ASPECT_RATIO = 3 / 1;

const PictureParagraph = ({ form: { setValue, getValues, watch, register, trigger, formState: { errors } } }, ref) => {
  const [imageToDelete, setImageToDelete] = useState(null);
  const [initialValue, setInitialValue] = useState(null);
  const imageUrl = watch('data.image');

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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StyledInputBase
          multiline={true}
          sx={{ width: '100%' }}
          minRows={5}
          maxRows={15}
          {...register('data.paragraph', { required: true, maxLength: 2000 })}
        />
        {errors && errors?.data?.paragraph && (
          <ErrorMessage
            type={errors?.data?.paragraph?.type}
            maxLength={errors?.data?.paragraph?.type == 'maxLength' ? 2000 : null} />
        )}
      </Grid>
      <Grid item xs={6}>
        <Card
          sx={{
            width: 'fit-content',
            position: 'relative',
            overflow: 'visible',
            borderRadius: '5px'
          }}>
          {imageUrl
            ? (<>
              <IconButton
                size='small'
                onClick={() => {
                  setValue('data.imageFile', null)
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
              <img src={imageUrl} style={{ width: '150px', borderRadius: '5px' }} />
            </>)
            : (
              <div
                style={{
                  height: '100%',
                  aspectRatio: IMAGE_ASPECT_RATIO

                }} >
                <CameraAlt sx={{ fontSize: 36, color: '#dedede' }} />
              </div>
            )}
        </Card>
        <ImageUploader
          ratio={IMAGE_ASPECT_RATIO}
          onChange={async (file) => {
            setImageToDelete(imageUrl);
            setValue('data.imageFile', file);
            setValue('data.image', await getSrcFromFile(file))
          }}
        />

      </Grid>

    </Grid>
  )
}

export default PictureParagraph