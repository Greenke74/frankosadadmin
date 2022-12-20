import React, { useState, forwardRef, useImperativeHandle } from 'react'
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
const StepByStep = ({ form, setIdsToDelete }, ref) => {
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const { register, control, setValue, formState: { errors } } = form;
  const {
    fields,
    append,
    remove,
    update
  } = useFieldArray({
    control: control,
    name: 'data.steps',
    rules: { maxLength: 5, minLength: 1 }
  })

  const onBlockDelete = () => {
    const idsToDelete = [];
    fields.map(async (step) => {
      if (step.image) {
        idsToDelete.push(step.image);
      }
    })
    setIdsToDelete(prev => ([...prev, ...idsToDelete]));
  }

  const getBlockData = async (formData) => {
    await Promise.all(imagesToDelete.map(async (id) => await deleteImage(id)))
    setImagesToDelete([]);
    const steps = await Promise.all(
      (formData?.data?.steps ?? [])
        .map(async (step) => {
          const res = { ...step }

          if (step.imageFile) {
            const image = await uploadImage(step.imageFile)
            res.image = image;
            delete res.imageFile;
          }

          if (step.imageToDelete) {
            await deleteImage(step.imageToDelete);
            delete res.imageToDelete;
          }

          if (res.imageUrl) {
            delete res.imageUrl;
          }

          return res;
        })
        .filter(r => Boolean(r))
    )

    const result = { ...formData };
    result.data.steps = steps;
    return result;
  }

  useImperativeHandle(ref, () => ({
    getBlockData: async () => await getBlockData(form.getValues()),
    onBlockDelete: onBlockDelete
  }))

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
                      remove(idx);
                      if (c.image) {
                        setImagesToDelete(prev => ([...prev, c.image]))
                      }
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
                  <FormControl variant='standard' fullWidth sx={{
                    '& .MuiInputBase-root': {
                      position: 'relative'
                    },
                    '& .MuiInputAdornment-root': {
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
                    <StyledInputLabel required shrink htmlFor={`step-${c.id}`}>
                      Заголовок кроку
                    </StyledInputLabel>
                    <StyledInputBase
                      id={`step-${c.id}-title-input`}
                      startAdornment={
                        <InputAdornment position="start">
                          0{idx + 1}
                        </InputAdornment>
                      }
                      {...register(`data.steps.${idx}.title`, { required: true, maxLength: 100 })}
                    />
                  </FormControl>
                  {errors && errors?.data?.steps && errors?.data?.steps[idx]?.title && (
                    <ErrorMessage
                      type={errors?.data?.steps[idx]?.title?.type}
                      maxLength={errors?.data?.steps[idx]?.title?.type == 'maxLength' ? '100' : null} />
                  )}
                  <FormControl variant='standard' fullWidth sx={{ mt: 2 }}>
                    <StyledInputLabel required shrink htmlFor={`step-${c.id}`}>
                      Опис кроку
                    </StyledInputLabel>
                    <StyledInputBase multiline={true} minRows={5} maxRows={16} {...register(`data.steps.${idx}.description`, { required: true })} id={`step-${c.id}`} />
                  </FormControl>
                  {errors && errors?.data?.steps && errors?.data?.steps[idx]?.description && (
                    <ErrorMessage
                      type={errors?.data?.steps[idx]?.description?.type}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
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
                      render={({ field }) => {
                        console.log(field, c);
                        return (
                        <Box sx={{ maxHeight: '190px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%', }}>
                          <Card sx={{ mb: 2 }}>
                            {(field.value.imageUrl || field.value.image)
                              ? (<>
                                <img style={{ height: '100%' }} src={field.value.imageUrl ?? getImageSrc(field.value.image)} />
                              </>)
                              : (<Box sx={{ width: '315px', height: '155px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></Box>)}
                          </Card>
                          <ImageUploader
                            id={`step-${c.id}=image-uploader`}
                            ratio={IMAGE_ASPECT_RATIO}
                            onChange={async (file) => {
                              field.onChange({
                                ...field.value,
                                image: null,
                                imageUrl: await getSrcFromFile(file),
                                imageFile: file,
                                imageToDelete: field.value.image ? field.value.image : undefined
                              })
                            }}
                          />
                        </Box>
                      )}}
                    />
                  </FormControl>
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
              image: ''
            })}
          label='Додати крок'
        />)}
      </Box>
    </Box >
  )
}

export default forwardRef(StepByStep);