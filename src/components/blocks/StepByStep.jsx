import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

import { Box, Card, FormControl, Grid, IconButton, InputAdornment, Tooltip, Typography } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';

import AddButton from '../common/AddButton';
import ImageUploader from '../common/ImageUploader';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getSrcFromFile } from '../../helpers/file-helpers';
import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';
import { CameraAlt, Delete } from '@mui/icons-material';

const IMAGE_ASPECT_RATIO = 2 / 1;
const StepByStep = ({ form, appendImageToDelete }) => {

  const { register, control, formState: { errors } } = form;
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: 'data.steps',
    rules: { maxLength: 5, minLength: 1 }
  })

  console.log(errors);
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <FormControl variant="standard" fullWidth>
          <StyledInputLabel required shrink htmlFor="stepsBlockId">
            Заголовок блоку
          </StyledInputLabel>
          <StyledInputBase {...register('data.stepsBlockTitle', { required: true, maxLength: 100 })} id='stepsBlockId' />
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
              <Grid
                container
                spacing={2}
              >
                <Grid item xs={6} >
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
                      name={`data.steps.${idx}.title`}
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
                      name={`data.steps.${idx}.description`}
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
                      maxLength={errors?.data?.steps[idx]?.description?.type=='maxLength' ?500 : undefined}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ height: '100%' }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                      justifyContent: 'center',
                    }}>
                      <FormControl variant='standard' fullWidth sx={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                        <StyledInputLabel required shrink htmlFor={`step-${c.id}`} sx={{ marginBottom: '30px' }}>
                          Зображення до кроку
                        </StyledInputLabel>
                        <Controller
                          name={`data.steps.${idx}`}
                          control={control}
                          rules={{ validate: (value) => value?.image ? Boolean(value.image) : Boolean(value.imageUrl) || 'imageRequired' }}
                          render={({ field }) => {
                            return (
                              <Box sx={{ mt: 3, maxWidth: '100%', maxHeight: '170px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <Card sx={{ mb: 2}}>
                                  {(field.value.imageUrl || field.value.image)
                                    ? (<>
                                      <img style={{ height: '135.5px' }} src={field.value.imageUrl ?? getImageSrc(field.value.image)} />
                                    </>)
                                    : (<Box sx={{ width: '315px', height: '155px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></Box>)}
                                </Card>
                                <ImageUploader
                                  id={`step-${c.id}-image-uploader`}
                                  ratio={IMAGE_ASPECT_RATIO}
                                  onChange={async (file) => {
                                    field.onChange({
                                      ...field.value,
                                      image: null,
                                      imageUrl: await getSrcFromFile(file),
                                      imageFile: file,
                                    })
                                  }}
                                />
                              </Box>
                            )
                          }}
                        />
                      </FormControl>
                      {errors && errors?.data?.steps && errors?.data?.steps[idx]?.type === 'validate' && errors?.data?.steps[idx]?.message === 'imageRequired' && (
                        <ErrorMessage
                          type={'imageRequired'}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
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