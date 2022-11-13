import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';
import { Button, FormControl, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';


const StepByStep = ({ form }) => {
  const { register, control } = form
  const {
    fields,
    append,
    remove,
    move
  } = useFieldArray({
    control: form.control,
    name: 'data.stepByStep',
    rules: { maxLength: 5 }
  })


  return (
    <Box>
      <Grid container spacing={2}>
        {fields.map((c, idx) => (
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
                  <Controller
                    name={`data.stepByStep.${idx}.title`}
                    control={control}
                    rules={{ maxLength: 100, required: true }}
                    render={({ field }) => (
                      <StyledInputBase value={field.value} onChange={field.onChange} id={`step-${c.id}`} />
                    )}
                  />
                </FormControl>
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Номер кроку
                  </StyledInputLabel>
                  <Controller
                    name={`data.stepByStep.${idx}.number`}
                    control={control}
                    rules={{ maxLength: 2, required: true }}
                    render={({ field }) => (
                      <StyledInputBase value={field.value} onChange={field.onChange} id={`step-${c.id}`} />
                    )}
                  />
                </FormControl>
                <FormControl variant='standard' required fullWidth>
                  <StyledInputLabel shrink htmlFor={`step-${c.id}`}>
                    Опис кроку
                  </StyledInputLabel>
                  <Controller
                    name={`data.stepByStep.${idx}.description`}
                    control={control}
                    rules={{ maxLength: 500, required: true }}
                    render={({ field }) => (
                      <StyledInputBase multiline rows={3} value={field.value} onChange={field.onChange} id={`step-${c.id}`} />
                    )}
                  />
                </FormControl>
              </Box>
            </Box>
          </Grid>
        ))}
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
              description: ' '
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