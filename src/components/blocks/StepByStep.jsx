import React from 'react'
import { useFieldArray } from 'react-hook-form'

import { Box, FormControl, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';

import AdornmentTextField from '../common/AdornmentTextField';
import AddButton from '../common/AddButton';
import ImageUploader from '../common/ImageUploader';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getSrcFromFile } from '../../helpers/file-helpers';


const StepByStep = ({ form }) => {
  const { register, control } = form
  const {
    fields,
    append,
    remove,
    update
  } = useFieldArray({
    control: control,
    name: 'data.steps',
    rules: { maxLength: 5 }
  })

  return (
    <Box>
      <Box marginBottom={2}>
        <FormControl variant="standard" required fullWidth>
          <StyledInputLabel shrink htmlFor="stepsBlockId">
            Заголовок
          </StyledInputLabel>
          <StyledInputBase {...register('data.stepsBlockTitle', { required: true })} id='stepsBlockId' />
        </FormControl>
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
                    onClick={() => remove(idx)}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box marginBottom={2}>
                <FormControl variant='standard' required fullWidth sx={{ mb: 2 }}>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Заголовок кроку
                  </StyledInputLabel>
                  <AdornmentTextField id={`step-${c.id}`} adornmentText={`0${idx + 1}`} {...register(`data.steps.${idx}.title`, { required: true })} placeholder='Заголовок кроку' />
                </FormControl>
                <FormControl variant='standard' required fullWidth sx={{ mb: 2 }}>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Опис кроку
                  </StyledInputLabel>
                  <StyledInputBase multiline={true} minRows={4} maxRows={16} {...register(`data.steps.${idx}.description`, { required: true })} id={`step-${c.id}`} />
                </FormControl>
                <FormControl variant='standard' required fullWidth >
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`} sx={{ marginBottom: '30px' }}>
                    Зображення до кроку
                  </StyledInputLabel>
                  <Box margin={'25px 0'} display='flex' flexDirection='column' alignItems='center'>
                    <ImageUploader id={`step-${c.id}`} onChange={async (file) => {
                      update(idx, { ...c, image: await getSrcFromFile(file), imageFile: file })
                    }} />
                    <img src={c.image} style={{
                      width: '100%',
                      marginTop: '15px',
                      borderRadius: '8px'
                    }} />
                  </Box>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box display='flex' justifyContent='center' marginTop={4}>
        <AddButton
          onClick={() => fields.length < 5 &&
            append({
              title: '',
              description: '',
              image: ''
            })}
          label='Додати крок'
        />
      </Box>
    </Box >
  )
}

export default StepByStep