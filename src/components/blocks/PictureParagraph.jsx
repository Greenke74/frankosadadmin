import React, { useState } from 'react'
import { Controller } from 'react-hook-form';

import { Box, Button, Grid } from '@mui/material'
import ImageUploader from '../common/ImageUploader'
import ErrorMessage from '../common/ErrorMessage'
import { CommonButton, StyledInputBase } from '../common/StyledComponents'

import { getSrcFromFile } from '../../helpers/file-helpers'
import { getImageSrc } from '../../services/storage-service'
import { v1 as uuid } from 'uuid'
import ImageCard from '../common/ImageCard';

import AutorenewIcon from '@mui/icons-material/Autorenew';

const IMAGE_ASPECT_RATIO = 5 / 3;

const PictureParagraph = ({
  registerName,
  register,
  control,
  errors,
  getValues,
  appendImageToDelete
}) => {
  const [imageFirst, setImageFirst] = useState(getValues('data.imageFirst'));
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Controller
          name={`${registerName}.data.imageFirst`}
          control={control}
          render={({ field }) => (
            <CommonButton
              startIcon={<AutorenewIcon />}
              onClick={() => setImageFirst(prev => {
                field.onChange(!prev)
                return !prev;
              })}
            >Поміняти місцями
            </CommonButton>
          )}
        />
      </Box>
      <Grid container spacing={2} >
        <Grid item xs={12} lg={6} sx={{ order: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', margin: 'auto' }}>
            <Controller
              name={`${registerName}.data.image`}
              control={control}
              shouldUnregister={true}
              rules={{ validate: (value) => value?.url ? Boolean(value?.url) : Boolean(value?.imageSrc) || 'imageRequired' }}
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
                      error={errors && errors?.data && errors?.data?.image}
                      ratio={IMAGE_ASPECT_RATIO}
                      onClickDelete={() => {
                        field.value?.image && appendImageToDelete(field.value?.image)
                        field.onChange({
                          ...field.value,
                          imageFile: '',
                          imageSrc: null,
                          url: ''
                        })
                      }}
                    />
                    <Box sx={{ mb: 2, mt: 1, width: '100%' }}>
                      {errors && errors.data?.image && (
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
        </Grid>
        <Grid item xs={12} lg={6} sx={{ order: imageFirst ? 2 : 0 }}>
          <Box sx={{ width: '100%' }}>
            <StyledInputBase
              placeholder='Текст'
              multiline={true}
              minRows={8}
              maxRows={16}
              fullWidth={true}
              {...register(`${registerName}.data.paragraph`, { required: true, maxLength: 2000 })} />
            {errors && errors?.data?.paragraph && (
              <Box sx={{ alignSelf: 'start', mt: 1 }}>
                <ErrorMessage
                  type={errors?.data?.paragraph?.type}
                  maxLength={errors?.data?.paragraph?.type == 'maxLength' ? 2000 : null} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default PictureParagraph;