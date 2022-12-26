import React from 'react'
import { Controller } from 'react-hook-form';

import { Box, Card, FormControl } from '@mui/material'
import ImageUploader from '../common/ImageUploader'

import { CameraAlt } from '@mui/icons-material'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { StyledInputBase } from '../common/StyledComponents'
import { getImageSrc } from '../../services/storage-service'
import { v1 as uuid } from 'uuid'
import ErrorMessage from '../common/ErrorMessage'
import ImageDeleteButton from '../common/ImageDeleteButton';

const IMAGE_ASPECT_RATIO = 4 / 1;

const PictureDescription = ({
  registerName,
  register,
  control,
  errors,
  appendImageToDelete
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', pb: 1 }}>
        <Controller
          name={`${registerName}.data`}
          control={control}
          rules={{ validate: (value) => value?.image ? Boolean(value.image) : Boolean(value.imageUrl) || 'imageRequired' }}
          render={({ field }) => {
            return (
              <>
                <Box sx={{
                  mt: 3,
                  maxWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {(field.value?.imageUrl || field.value?.image) && (
                    <ImageDeleteButton
                      onClick={() => {
                        field.value?.image && appendImageToDelete(field.value?.image)
                        field.onChange({
                          ...field.value,
                          imageFile: null,
                          imageUrl: '',
                          image: ''
                        })
                      }}
                    />
                  )}
                  <Card sx={{ boxShadow: errors?.image?.message == 'imageRequired' ? '0px 0px 3px 0px red' : undefined, width: '415px', display: 'flex' }}>
                    {(field.value?.imageUrl || field.value?.image)
                      ? (<>
                        <img style={{ width: '100%' }} src={field.value?.imageUrl ?? getImageSrc(field.value?.image)} />
                      </>)
                      : (<Box sx={{ width: '415px', height: '135.5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></Box>)}
                  </Card>
                </Box>
                <Box sx={{ mb: 2, mt: 1, width: '315px' }}>
                  {errors && errors.image && (
                    <ErrorMessage type='imageRequired' />
                  )}
                </Box>
                <ImageUploader
                  id={`${uuid()}-image-uploader`}
                  ratio={IMAGE_ASPECT_RATIO}
                  onChange={async (file) => {
                    field.onChange({
                      ...field.value,
                      image: null,
                      imageUrl: await getSrcFromFile(file),
                      imageFile: file,
                    })


                  }}
                  buttonDisabled={field.value?.imageUrl || field.value?.image}
                />
              </>
            )
          }}
        />
      </Box>
      {errors && errors?.data && errors?.data?.type === 'validate' && errors?.data?.message === 'imageRequired' && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorMessage
            type={'imageRequired'}
          />
        </Box>
      )}
      <FormControl sx={{ pt: 3 }} variant="standard" fullWidth >
        <StyledInputBase placeholder='Підпис до зображення' id='description-input' {...register(`${registerName}.data.description`, { required: true, maxLength: 100 })} />
      </FormControl>
      {errors && errors?.data?.description && (
        <Box sx={{ alignSelf: 'start', mt: 1 }}>
          <ErrorMessage
            type={errors?.data?.description?.type}
            maxLength={errors?.data?.description?.type == 'maxLength' ? 2000 : null} />
        </Box>
      )}
    </Box>
  )
}

export default PictureDescription;