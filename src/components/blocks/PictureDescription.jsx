import React from 'react'
import { Controller } from 'react-hook-form';

import { Box, FormControl } from '@mui/material'
import ImageUploader from '../common/ImageUploader'
import ErrorMessage from '../common/ErrorMessage'
import { StyledInputBase } from '../common/StyledComponents'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { getImageSrc } from '../../services/storage-service'
import { v1 as uuid } from 'uuid'
import ImageCard from '../common/ImageCard';

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
          name={`${registerName}.data.image`}
          control={control}
          shouldUnregister={true}
          rules={{ validate: (value) => value?.url ? Boolean(value.url) : Boolean(value.imageSrc) || 'imageRequired' }}
          render={({ field }) => {
            return (
              <>
                <ImageCard
                  src={field.value?.url
                    ? getImageSrc(field.value?.url)
                    : field.value?.imageSrc
                      ? field.value?.imageSrc
                      : null
                  }
                  error={errors?.image?.message == 'imageRequired'}
                  ratio={IMAGE_ASPECT_RATIO}
                  onClickDelete={() => {
                    field.value?.image && appendImageToDelete(field.value?.image)
                    field.onChange({
                      ...field.value,
                      imageFile: null,
                      imageSrc: '',
                      image: ''
                    })
                  }}
                />
                <Box sx={{ mb: 2, mt: 1, width: '315px' }}>
                  {errors && errors.image && (
                    <ErrorMessage type='imageRequired' />
                  )}
                </Box>
                <ImageUploader
                  id={`${uuid()}-image-uploader`}
                  ratio={IMAGE_ASPECT_RATIO}
                  onChange={async (file) => {
                    if (file) {
                      field.onChange({
                        ...field.value,
                        url: null,
                        imageSrc: await getSrcFromFile(file),
                        imageFile: file,
                      })
                    }
                  }}
                  buttonDisabled={field.value?.imageSrc || field.value?.url}
                />
              </>
            )
          }}
        />
      </Box>
      {errors && errors?.data && errors?.data?.image?.type === 'validate' && errors?.data?.image?.message === 'imageRequired' && (
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
            maxLength={errors?.data?.description?.type == 'maxLength' ? 100 : null} />
        </Box>
      )}
    </Box>
  )
}

export default PictureDescription;