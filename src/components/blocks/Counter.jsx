import React from 'react'
import { useFieldArray, Controller } from 'react-hook-form';

import { Button, FormControl, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';
import ErrorMessage from '../common/ErrorMessage';

const Counter = ({ form }) => {
  const { register, control, formState: { errors } } = form;
  const {
    fields,
    append,
    remove,
    move
  } = useFieldArray({
    control: form.control,
    name: 'data.counters',
    rules: { maxLength: 4 }
  })

  return (
    <Box>
      <Grid container spacing={2}>
        {fields.map((c, idx) => (
          <Grid item xs={6} lg={3} key={c.id} >
            <Box
              bgcolor='#f7f7f7'
              borderRadius={2}
              display='flex'
              justifyContent='center'
              flexDirection='column'
              padding={2}
            >
              <Box
                marginBottom={2}
                display='flex'
                width='100%'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography
                  fontSize={18}
                  textAlign='center'
                  color='var(--theme-color)'
                  fontWeight={500}
                  flexGrow={1}
                >
                  Лічильник №{idx + 1}
                </Typography>
                <Tooltip disableFocusListener title='Видалити лічильник'>
                  <IconButton
                    color='error'
                    onClick={() => remove(idx)}
                  ><HighlightOffIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box marginBottom={2}>
                <FormControl variant="standard" required fullWidth>
                  <StyledInputLabel shrink htmlFor={`counter-${c.id}`}>
                    Заголовок лічильника
                  </StyledInputLabel>
                  <Controller
                    name={`data.counters.${idx}.title`}
                    control={control}
                    rules={{ maxLength: 100, required: true }}
                    render={({ field }) => (
                      <StyledInputBase value={field.value} onChange={field.onChange} id={`counter-${c.id}`} />
                    )}
                  />
                </FormControl>
              </Box>
              <FormControl variant="standard" required fullWidth>
                <StyledInputLabel shrink htmlFor={`counter-${c.id}`}>
                  Лічильник
                </StyledInputLabel>
                <Controller
                  name={`data.counters.${idx}.counter`}
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledInputBase type='number' value={field.value} onChange={field.onChange} id={`counter-${c.id}`} />
                  )}
                />
                {errors?.data?.counters[idx]?.counter?.type == 'min' && <ErrorMessage type='min' />}
              </FormControl>
            </Box>
          </Grid>
        )
        )}
      </Grid>
      <Box display='flex' justifyContent='center' marginTop={4}>
        <Button
          startIcon={<AddIcon />}
          variant='text'
          style={{ textTransform: 'none', color: 'var(--theme-color)' }}
          onClick={() => fields.length < 4 && append({ title: ' ', counter: 0 })}
          sx={{
            padding: '6px 15px !important',
            '& > span': { marginRight: '8px !important' }
          }}
        >
          Додати лічильник
        </Button>
      </Box>
    </Box>
  )
}

export default Counter