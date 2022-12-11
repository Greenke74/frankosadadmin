import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useFieldArray } from 'react-hook-form'

import { Box, FormControl, Grid, IconButton, InputAdornment, Tooltip, Typography } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';

import AddButton from '../common/AddButton';
import ImageUploader from '../common/ImageUploader';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getSrcFromFile } from '../../helpers/file-helpers';
import { deleteImage, getImageSrc, uploadImage } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';

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

  const onDeleteBlock = async () => {
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
    onDeleteBlock: onDeleteBlock
  }))

  return (
    <Box>
      <Box marginBottom={2}>
        <FormControl variant="standard" fullWidth>
          <StyledInputLabel shrink htmlFor="stepsBlockId">
            Заголовок*
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
      <Grid container spacing={2}>
        {fields.map((c, idx) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={c.id}>
            <Box
              bgcolor='#f7f7f7'
              display='flex'
              justifyContent='center'
              flexDirection='column'
              padding={2}
              borderRadius={2}
            >
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                width='100%'
                marginBottom={2}
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
              <Box marginBottom={2}>
                <FormControl variant='standard' focused={true} fullWidth sx={{
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
                <FormControl variant='standard' focused={false} fullWidth sx={{ mt: 2 }}>
                  <StyledInputLabel required shrink htmlFor={`step-${c.id}`}>
                    Опис кроку
                  </StyledInputLabel>
                  <StyledInputBase multiline={true} minRows={4} maxRows={16} {...register(`data.steps.${idx}.description`, { required: true })} id={`step-${c.id}`} />
                </FormControl>
                {errors && errors?.data?.steps && errors?.data?.steps[idx]?.description && (
                  <ErrorMessage
                    type={errors?.data?.steps[idx]?.description?.type}
                  />
                )}
                <FormControl variant='standard' fullWidth sx={{ mt: 2 }} >
                  <StyledInputLabel required shrink htmlFor={`step-${c.id}`} sx={{ marginBottom: '30px' }}>
                    Зображення до кроку
                  </StyledInputLabel>
                  <Box margin={'25px 0 '} display='flex' flexDirection='column' alignItems='center'>
                    <Box sx={{ mt: 1 }}>
                      <ImageUploader
                        id={`step-${c.id}`}
                        ratio={IMAGE_ASPECT_RATIO}
                        onChange={async (file) => {
                          update(
                            idx,
                            {
                              ...c,
                              image: null,
                              imageUrl: await getSrcFromFile(file),
                              imageFile: file,
                              imageToDelete: c.image ? c.image : undefined
                            }
                          )
                        }} />
                    </Box>
                    {(c.imageUrl || c.image) ? (
                      <img src={c.imageUrl ?? getImageSrc(c.image)} style={{
                        width: '100%',
                        marginTop: '15px',
                        borderRadius: '8px'
                      }} />
                    ) : null}
                  </Box>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
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