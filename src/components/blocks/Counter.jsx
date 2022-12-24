import React from 'react'
import { useFieldArray, Controller } from 'react-hook-form';

import { FormControl, Grid, Grow, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';
import ErrorMessage from '../common/ErrorMessage';
import AddButton from '../common/AddButton';

const Counter = ({
  registerName,
  control,
  errors
}) => {
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control: control,
    name: `${registerName}.data.counters`,
    rules: {
      maxLength: 3,
      minLength: 1,
      validate: (value) => {
        return value.length > 0
      }
    }
  })

  return (
    <Box>
      <Grid container spacing={2}>
        {fields.map((c, idx) => (
          <Grid item xs={6} lg={3} key={c.id} >
            <Grow in={idx !== null}>
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
                  <FormControl variant="standard" fullWidth >
                    <StyledInputLabel required shrink htmlFor={`counter-${c.id}`}>
                      Заголовок лічильника
                    </StyledInputLabel>
                    <Controller
                      name={`${registerName}.data.counters.${idx}.title`}
                      control={control}
                      rules={{ maxLength: 100, required: true }}
                      render={({ field }) => (
                        <StyledInputBase
                          value={field.value}
                          onChange={field.onChange}
                          id={`counter-${c.id}`}
                          name={`data-counters${idx}-title`}
                        />
                      )}
                    />
                    {errors && errors?.data?.counters && errors?.data?.counters[idx]?.title && (
                      <Box sx={{ mt: 1 }}>
                        <ErrorMessage
                          type={errors.data.counters[idx]?.title?.type}
                          maxLength={errors.data.counters[idx]?.title?.type == 'maxLength' ? 100 : null} />
                      </Box>
                    )}
                  </FormControl>
                </Box>
                <FormControl variant="standard" fullWidth>
                  <StyledInputLabel required shrink htmlFor={`counter-${c.id}`}>
                    Лічильник
                  </StyledInputLabel>
                  <Controller
                    name={`${registerName}.data.counters.${idx}.counter`}
                    control={control}
                    rules={{ min: 0, required: true }}
                    render={({ field }) => (
                      <StyledInputBase
                        type='number'
                        value={field.value}
                        onChange={field.onChange}
                        name={`data-counters${idx}-counter`}
                        id={`counter-${c.id}`}
                      />
                    )}
                  />
                  {errors && errors?.data?.counters && errors?.data?.counters[idx]?.counter && (
                    <Box sx={{ mt: 1 }}>
                      <ErrorMessage
                        type={errors.data.counters[idx]?.counter?.type}
                        min={errors.data.counters[idx]?.counter?.type == 'min' ? 0 : null} />
                    </Box>
                  )}
                </FormControl>
              </Box>
            </Grow>
          </Grid>
        )
        )}
      </Grid>
      <Box display='flex' justifyContent='center' marginTop={4}>
        {fields.length < 3 && (<AddButton
          label='Додати лічильник'
          onClick={() => fields.length < 3 && append({ title: '', counter: 0 })}
        />)}
      </Box>
    </Box >
  )
}

export default Counter