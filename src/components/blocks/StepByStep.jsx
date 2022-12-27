import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

import { Box, Card, FormControl, Grid, Grow, IconButton, InputAdornment, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';

import AddButton from '../common/AddButton';
import ImageUploader from '../common/ImageUploader';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getSrcFromFile } from '../../helpers/file-helpers';
import { getImageSrc } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';
import { CameraAlt } from '@mui/icons-material';
import ImageCard from '../common/ImageCard';

const IMAGE_ASPECT_RATIO = 2 / 1;
const StepByStep = ({
  registerName,
  register,
  control,
  errors,
  appendImageToDelete
}) => {
  const isLaptop = useMediaQuery('(max-width:900px)')

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: `${registerName}.data.steps`,
    rules: { maxLength: 5, minLength: 1 }
  })

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <FormControl variant="standard" fullWidth>
          <StyledInputLabel required shrink htmlFor="stepsBlockId">
            Заголовок блоку
          </StyledInputLabel>
          <StyledInputBase {...register(`${registerName}.data.stepsBlockTitle`, { required: true, maxLength: 100 })} id='stepsBlockId' />
        </FormControl>
        {errors && errors?.data?.stepsBlockTitle && (
          <Box sx={{ mt: 1 }}>
            <ErrorMessage
              type={errors.data?.stepsBlockTitle?.type}
              maxLength={errors?.data?.stepsBlockTitle?.type == 'maxLength' ? '100' : null} />
          </Box>
        )}
      </Box>
      <Grid container spacing={3}>
        {fields.map((c, idx) => (
          <Grid item xs={12} key={c.id} >
            <Grow in={idx !== undefined}>
              <Box sx={{
                bgcolor: '#f7f7f7',
                borderRadius: 2,
                padding: 2
              }}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <Typography
                    textAlign='center'
                    fontSize={18}
                    color='var(--theme-color)'
                    fontWeight={500}
                    flexGrow={1}
                  >
                    Крок №{idx + 1}
                  </Typography>
                  <Tooltip disableFocusListener title='Видалити крок'>
                    <IconButton
                      color='error'
                      onClick={() => {
                        if (c.image) {
                          appendImageToDelete(c.image)
                        }
                        remove(idx);
                      }}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ my: 2 }}>
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant='standard'
                        fullWidth
                        sx={{
                          '& .MuiInputBase-root': {
                            position: 'relative'
                          },
                          '& .MuiInputAdornment-root': {
                            pointerEvents: 'none',
                            position: 'absolute',
                            width: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0 10px',
                            bgcolor: '#cccccc80',
                            height: 'auto',
                            lineHeight: '26px',
                            borderRadius: 1,
                            margin: '8px !important',
                            color: 'var(--theme-color)',
                            fontWeight: 700,
                            zIndex: 1
                          },
                          '& .MuiInputBase-input': {
                            paddingLeft: '56px'
                          }
                        }}>
                        <StyledInputLabel required shrink htmlFor={`step-${idx}-title-input`}>
                          Заголовок кроку
                        </StyledInputLabel>
                        <Controller
                          name={`${registerName}.data.steps.${idx}.title`}
                          control={control}
                          rules={{ required: true, maxLength: 100 }}
                          render={({ field }) => (
                            <StyledInputBase
                              id={`step-${idx}-title-input`}
                              value={field.value}
                              onChange={field.onChange}
                              startAdornment={
                                <InputAdornment position="start">
                                  0{idx + 1}
                                </InputAdornment>
                              }
                            />
                          )}
                        />
                      </FormControl>
                      {errors && errors?.data?.steps && errors?.data?.steps[idx]?.title && (
                        <ErrorMessage
                          type={errors?.data?.steps[idx]?.title?.type}
                          maxLength={errors?.data?.steps[idx]?.title?.type == 'maxLength' ? '100' : null} />
                      )}
                      <FormControl variant='standard' fullWidth sx={{ mt: 2 }}>
                        <StyledInputLabel required shrink htmlFor={`step-${idx}-description-input`}>
                          Опис кроку
                        </StyledInputLabel>
                        <Controller
                          name={`${registerName}.data.steps.${idx}.description`}
                          control={control}
                          rules={{ required: true, maxLength: 500 }}
                          render={({ field }) => (
                            <StyledInputBase
                              id={`step-${idx}-description-input`}
                              multiline={true}
                              minRows={5}
                              maxRows={16}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </FormControl>
                      {errors && errors?.data?.steps && errors?.data?.steps[idx]?.description && (
                        <ErrorMessage
                          type={errors?.data?.steps[idx]?.description?.type}
                          maxLength={errors?.data?.steps[idx]?.description?.type == 'maxLength' ? 500 : undefined}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', margin: 'auto', height: '100%', justifyContent: 'center', gap: 1 }}>
                        <Controller
                          name={`${registerName}.data.steps.${idx}`}
                          control={control}
                          rules={{ validate: (value) => value?.image ? Boolean(value.image) : Boolean(value.imageUrl) || 'imageRequired' }}
                          render={({ field }) => {
                            return (
                              <>
                                <ImageCard
                                  src={field.value?.image
                                    ? getImageSrc(field.value?.image)
                                    : field.value?.imageUrl
                                      ? field.value?.imageUrl
                                      : null
                                  }
                                  error={errors && errors?.data.steps[idx] && errors?.data.steps[idx].message == 'imageRequired'}
                                  ratio={IMAGE_ASPECT_RATIO}
                                  customDivideBy={isLaptop ? 5 : 9}
                                  onClickDelete={() => {
                                    field.value?.image && appendImageToDelete(field.value?.image)
                                    field.onChange({
                                      ...field.value,
                                      imageFile: null,
                                      imageUrl: '',
                                      image: ''
                                    })
                                  }}
                                />
                                <Box sx={{ alignSelf: 'start' }}>
                                  {errors && errors?.data?.steps[idx] && errors?.data?.steps[idx].message == 'imageRequired' && (
                                    <ErrorMessage type='imageRequired' />
                                  )}
                                </Box>
                                <ImageUploader
                                  id={`step-${c.id}-image-uploader`}
                                  ratio={IMAGE_ASPECT_RATIO}
                                  onChange={async (file) => {
                                    if (file) {
                                      field.onChange({
                                        ...field.value,
                                        image: '',
                                        imageUrl: await getSrcFromFile(file),
                                        imageFile: file,
                                      })
                                    }
                                  }}
                                  buttonDisabled={field.value?.image || field.value?.imageUrl}
                                />
                              </>
                            )
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grow>
          </Grid >
        ))}
      </Grid >
      <Box display='flex' justifyContent='center' marginTop={4}>
        {fields.length < 5 && (<AddButton
          onClick={() => fields.length < 5 &&
            append({
              title: '',
              description: '',
              image: '',
              imageFile: null
            })}
          label='Додати крок'
        />)}
      </Box>
    </Box >
  )
}

export default StepByStep;