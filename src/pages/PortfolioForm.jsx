import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Alert, FormControl, FormControlLabel, Grid, Typography } from '@mui/material';
import { CancelButton, StyledCheckbox, StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents';
import ErrorMessage from '../components/common/ErrorMessage';
import SaveButton from '../components/common/SaveButton';
import { Box } from '@mui/system';
import { getCompletedProject } from '../services/portfolio-api-service';
import { postImage } from '../services/images-api-service';

const PortfolioForm = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { reset, setValue, watch, handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      location: '',
      alias: '',
      image: '',
      description: '',
      is_published: true,
      completed_at: new Date().toISOString().substr(0, 10)
    },
    mode: 'onSubmit'
  })

  const is_published = watch('is_published')

  useEffect(() => {
    !isNaN(id) && getCompletedProject(id).then(res => {
      reset({ ...res, completed_at: res.completed_at.substr(0, 10) });
    })

    postImage().then(res => console.log(res));
  }, [id])

  const onSubmit = (data) => {
  }

  return (
    <Box padding={2}>
      <Typography padding={2} marginBottom={1} fontSize='24px' fontWeight={500} color='var(--theme-color)'>
        {isNaN(id)
          ? 'Створення нового об\'єкта портфоліо'
          : 'Редагування об\'єкта портфоліо'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction='column' style={{ gap: 16 }} >
          <Grid item>
            <Box bgcolor='#dedede52' padding={2} borderRadius='8px'>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7} >
                  <Box display='flex' paddingLeft={1} flexWrap='nowrap' height='100%' alignItems='center'>
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={is_published} onChange={((e) => setValue('is_published', e.target.checked))} />
                      }
                      label={'Опублікувати'}
                    />
                    {is_published
                      ? <Alert severity='success'>
                        Цей об'єкт відображатиметься на сторінці "Потрфоліо"
                      </Alert>
                      : <Alert severity='info'>
                        Цей об'єкт буде збережено як чернетку
                      </Alert>}
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" required fullWidth>
                    <StyledInputLabel shrink htmlFor="completedAtInput">
                      Дата здачі
                    </StyledInputLabel>
                    <StyledInputBase type='date' error={!!(errors?.completed_at)} placeholder={'Дата здачі'} id='completedAtInput' {...register('completed_at', { required: true })} />
                  </FormControl>
                  {errors.completed_at && <ErrorMessage type={errors?.completed_at?.type} />}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" required fullWidth>
                <StyledInputLabel shrink htmlFor="titleInput">
                  Заголовок об'єкта
                </StyledInputLabel>
                <StyledInputBase error={!!(errors?.title)} placeholder={'Заголовок об\'єкта'} id='titleInput' {...register('title', { required: true, maxLength: 30 })} />
              </FormControl>
              {errors.title && <ErrorMessage type={errors?.title?.type} maxLength={errors?.title?.type === 'maxLength' ? 30 : undefined} />}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" required fullWidth>
                <StyledInputLabel shrink htmlFor="locationInput">
                  Локація
                </StyledInputLabel>
                <StyledInputBase error={!!(errors?.location)} placeholder={'Локація'} id='locationInput' {...register('location', { required: true, maxLength: 30 })} />
              </FormControl>
              {errors.location && <ErrorMessage type={errors?.location?.type} maxLength={errors?.location?.type === 'maxLength' ? 30 : undefined} />}
            </Grid>
          </Grid>
          <Grid item>
            <FormControl variant="standard" required fullWidth>
              <StyledInputLabel shrink htmlFor="descriptionInput">
                Короткий опис
              </StyledInputLabel>
              <StyledInputBase multiline={true} rows={3} error={!!(errors?.description)} placeholder={'Короткий опис'} id='descriptionInput' {...register('description', { maxLength: 100 })} />
            </FormControl>
            {errors.description && <ErrorMessage type={errors?.description?.type} maxLength={errors?.description?.type === 'maxLength' ? 100 : undefined} />}
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='end' alignItems='center' marginTop={2} style={{ gap: 20 }}>
          <Link to="/" style={{ color: 'var(--theme-color)' }}>Перейти до редагування сторінки проєкту</Link>
          <CancelButton onClick={() => navigate('/portfolio')}>Скасувати</CancelButton>
          <SaveButton type='submit' />
        </Box>
      </form>
    </Box>
  )
}

export default PortfolioForm