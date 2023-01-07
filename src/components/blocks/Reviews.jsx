import React from 'react'
import { useFieldArray, Controller } from 'react-hook-form';

import { FormControl, Grid, Grow, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { StyledInputBase, StyledInputLabel } from '../common/StyledComponents';
import ErrorMessage from '../common/ErrorMessage';
import AddButton from '../common/AddButton';

const Reviews = ({
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
    name: `${registerName}.data.reviews`,
    rules: {
      maxLength: 30,
      minLength: 1,
      validate: {
        minLength: (value) => value.length > 0,
        maxLength: (value) => value.length < 31
      }
    }
  })
console.log(errors);
  return (
    <Box>
      {errors?.data?.reviews?.root?.type == 'minLength' ? (
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <Typography
            color='#BABABA'
            textAlign='center'
            fontSize='22px'
            fontWeight={600}
          >
            Відгуків немає
          </Typography>
          <Typography
            sx={{
              color: 'red',
              fontSize: '14px',
              fontWeight: 400,
              mt: 1,
              textAlign: 'center'
            }}
          >
            Додайте щонайменше 1 відгук до блока
          </Typography>
        </Box>
      ) : (
        <Box sx={{overflowX: 'scroll'}}>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2 }}>
            {fields.map((c, idx) => (
              <Box sx={{minWidth:'300px'}} key={c.id} >
                <Grow in={idx !== undefined}>
                  <Box
                    bgcolor='#f7f7f7'
                    borderRadius={2}
                    display='flex'
                    justifyContent='center'
                    flexDirection='column'
                    padding={2}
                  >
                    <Box
                      marginBottom='-20px'
                      display='flex'
                      width='100%'
                      justifyContent='end'
                      alignItems='center'
                    >
                      <Tooltip disableFocusListener title='Видалити відгук'>
                        <IconButton
                          color='error'
                          onClick={() => remove(idx)}
                        ><HighlightOffIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel required shrink htmlFor={`counter-${c.id}`}>
                        Відгук
                      </StyledInputLabel>
                      <Controller
                        name={`${registerName}.data.reviews.${idx}.value`}
                        control={control}
                        rules={{ required: true, maxLength: 1000 }}
                        render={({ field }) => (
                          <StyledInputBase
                            multiline={true}
                            minRows={5}
                            maxRows={12}
                            placeholder='Введіть відгук клієнта'
                            value={field.value}
                            onChange={field.onChange}
                            name={`data-reviews${idx}-content`}
                            id={`counter-${c.id}`}
                          />
                        )}
                      />
                      {errors && errors?.data?.reviews && errors?.data?.reviews[idx]?.value && (
                        <Box sx={{ mt: 1 }}>
                          <ErrorMessage
                            type={errors.data.reviews[idx]?.value?.type}
                            maxLength={errors.data.reviews[idx]?.value?.type == 'maxLength' ? 1000 : null}
                          />
                        </Box>
                      )}
                    </FormControl>
                  </Box>
                </Grow>
              </Box>
            )
            )}
          </Box>
        </Box>
      )
      }
      <Box display='flex' justifyContent='center' marginTop={4}>
        {fields.length < 31 && (<AddButton
          label='Додати відгук'
          onClick={() => fields.length < 31 && append({ value: '' })}
        />)}
      </Box>
    </Box >
  )
}

export default Reviews;