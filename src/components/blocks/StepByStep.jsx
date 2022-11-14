import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';
import { Button, FormControl, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';
import ImageUploader from '../common/ImageUploader';
import { getSrcFromFile } from '../../helpers/file-helpers';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';


const StepByStep = ({ form }) => {
  const { register, control, setValue, getValues } = form
  const {
    fields,
    append,
    remove,
    move
  } = useFieldArray({
    control: form.control,
    name: 'data.stepByStep.data',
    rules: { maxLength: 5 }
  })


  return (
    <Box>
      <Box marginBottom={2}>
        <FormControl variant="standard" required fullWidth>
          <StyledInputLabel shrink htmlFor="stepsBlockId">
            Заголовок
          </StyledInputLabel>
          <StyledInputBase {...register('data.stepByStep.stepsBlockTitle')} id='stepsBlockId' />
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {fields.map((c, idx) => { console.log(idx); return(
          <Grid item xs={12} lg={4} key={c.id}>
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
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Назва кроку
                  </StyledInputLabel>
                  <StyledInputBase {...register(`data.stepByStep.data.${idx}.title`)} id={`step-${c.id}`} />
                </FormControl>
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Номер кроку
                  </StyledInputLabel>
                  <StyledInputBase disabled value={`0${idx+1}`} onChange={setValue(`data.stepByStep.data.${idx}.number`, `0${idx+1}`)} id={`step-${c.id}`} />
                </FormControl>
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Опис кроку
                  </StyledInputLabel>
                  <StyledInputBase {...register(`data.stepByStep.data.${idx}.description`)} id={`step-${c.id}`} />
                </FormControl>
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`} style={{ marginBottom: '10px' }} >
                    Зображення до кроку {idx}
                  </StyledInputLabel>
                  <ImageUploader onClick={() => console.log(idx)}/>
                  <img src={getValues(`data.stepByStep.data.${idx}.image`)}/>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        )})}
      </Grid>
      <Box display='flex' justifyContent='center' marginTop={4}>
        <Button
          startIcon={<AddIcon />}
          variant='text'
          style={{ textTransform: 'none', color: 'var(--theme-color)' }}
          onClick={() => fields.length < 5 &&
            append({
              title: ' ',
              number: ' ',
              description: ' ',
              image: ' '
            })}
          sx={{
            padding: '6px 15px !important',
            '& > span': { marginRight: '8px !important' }
          }}
        >
          Додати крок
        </Button>
      </Box>
    </Box>
  )
}

export default StepByStep