import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { Box, Alert, Card, FormControl, FormControlLabel, Grid, IconButton, Typography, Select, MenuItem } from '@mui/material';
import { CancelButton, StyledCheckbox, StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents';
import ImageUploader from '../components/common/ImageUploader';
import SaveButton from '../components/common/SaveButton';
import ErrorMessage from '../components/common/ErrorMessage';
import Tabs from '../components/common/Tabs';
import BlocksComposition from '../components/BlocksComposition';

import { CameraAlt, Delete } from '@mui/icons-material';

import { getProject, insertProject } from '../services/portfolio-api-service';
import { getSrcFromFile } from '../helpers/file-helpers';
import { deleteImage, getImageSrc, uploadImage } from '../services/storage-service.js';
import { slugify, transliterate as tr } from 'transliteration';
import Swal from 'sweetalert2';
import { projectBlocks } from '../components/blocks/index.js';

const projectTypes = ['Приватний будинок', 'Житловий комплекс', 'Підприємство']

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { reset, getValues, setValue, watch, handleSubmit, register, formState: { errors }, control } = useForm({
    defaultValues: {
      title: '',
      location: '',
      type: '',
      alias: '',
      image: '',
      imageFile: null,
      is_published: true,
      completed_at: new Date().toISOString().substr(0, 10)
    },
    mode: 'onSubmit'
  })

  const is_published = watch('is_published')
  const image = watch('image')

  useEffect(() => {
    !isNaN(id) && getProject(id).then(res => {
      reset({
        ...getValues(),
        ...res,
        completed_at: res.completed_at.substr(0, 10),
        image: getImageSrc(res.image)
      });
    })

  }, [id])

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { title } = data;

    const payload = {
      ...data,
      alias: slugify(title.trim()?.slice(0, 75), { replace: [['.', '-']] })
    }

    if (data.imageFile) {
      await deleteImage(imageToDelete);
      const imageKey = await uploadImage(data.imageFile)
      setValue('image', getImageSrc(imageKey));
      setValue('imageFile', null);
      payload.image = imageKey
    } else {
      delete payload.image;
    }

    if (!payload.image) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Потрібно додати зображення',
        color: 'var(--theme-color)',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
      })
      return;
    }
    if (payload.id) {
      // update
    } else {
      const { data: { id } } = await insertProject(payload);
      navigate(`/projectform/${id}`);
      Swal.fire({
        position: 'top-right',
        icon: 'success',
        title: 'Обєкт успішно Збережено',
        color: 'var(--theme-color)',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
      }).finally(() => {
        setIsSubmitting(false);
      })
    }
  }

  return (
    <Box padding={2}>
      <Typography padding={2} marginBottom={1} fontSize='24px' fontWeight={500} color='var(--theme-color)'>
        {isNaN(id)
          ? 'Створення нового об\'єкта портфоліо'
          : 'Редагування об\'єкта портфоліо'}
      </Typography>

      <Tabs tabs={[
        {
          label: 'Загальна інформація',
          content: (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box bgcolor='#dedede52' padding={2} borderRadius='8px'>
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
              </Box>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={12} lg={7}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel shrink htmlFor="titleInput">
                        Заголовок об'єкта
                      </StyledInputLabel>
                      <StyledInputBase error={!!(errors?.title)} placeholder={'Заголовок об\'єкта'} id='titleInput' {...register('title', { required: true, maxLength: 50 })} />
                    </FormControl>
                    {errors.title && <ErrorMessage type={errors?.title?.type} maxLength={errors?.title?.type === 'maxLength' ? 50 : undefined} />}
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel shrink htmlFor="locationInput">
                        Локація
                      </StyledInputLabel>
                      <StyledInputBase error={!!(errors?.location)} placeholder={'Локація'} id='locationInput' {...register('location', { required: true, maxLength: 50 })} />
                    </FormControl>
                    {errors.location && <ErrorMessage type={errors?.location?.type} maxLength={errors?.location?.type === 'maxLength' ? 50 : undefined} />}
                    <FormControl variant="standard" fullWidth>
                      <StyledInputLabel shrink htmlFor="completedAtInput">
                        Дата здачі
                      </StyledInputLabel>
                      <StyledInputBase type='date' error={!!(errors?.completed_at)} placeholder={'Дата здачі'} id='completedAtInput' {...register('completed_at', { required: true })} />
                    </FormControl>
                    {errors.completed_at && <ErrorMessage type={errors?.completed_at?.type} />}
                    <Controller
                      name='type'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl fullWidth size='small' sx={{ mt: 1 }}>
                          <StyledInputLabel id='projectTypeSelectLabel' htmlFor="projectTypeSelect" >
                            Тип проєкту
                          </StyledInputLabel>
                          <Select
                            error={!!(errors?.completed_at)}
                            labelId="projectTypeSelectLabel"
                            label='Тип проєкту'
                            id='projectTypeSelect'
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            {projectTypes.map(t => (
                              <MenuItem key={t} value={t} >{t}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors.type && <ErrorMessage type={errors?.type?.type} />}
                  </Box>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
                    <StyledInputLabel required shrink htmlFor='imageUploader' sx={{ alignSelf: 'start' }}>
                      Зображення
                    </StyledInputLabel>
                    <Card sx={{ width: 'fit-content', position: 'relative', overflow: 'visible', borderRadius: '5px' }}>
                      {image
                        ? (<>
                          <IconButton size='small' onClick={() => {
                            // setImageToDelete(image);
                            setValue('image', null)
                          }
                          } sx={{ position: 'absolute', top: -17, right: -17, bgcolor: 'white', "&:hover": { bgcolor: '#dedede' } }}>
                            <Delete sx={{ color: 'red' }} />
                          </IconButton>
                          <img src={image} style={{ width: '250px', borderRadius: '5px' }} />
                        </>)
                        : (<div style={{ width: 250, height: 125, backgroundColor: '#f7eeee', display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></div>)}
                    </Card>
                    <ImageUploader
                      id='imageUploader'
                      ratio={2 / 1}
                      onChange={async (file) => {
                        setImageToDelete(image);
                        setValue('imageFile', file);
                        setValue('image', await getSrcFromFile(file))
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box display='flex' justifyContent='end' alignItems='center' marginTop={4} style={{ gap: 20 }}>
                <CancelButton onClick={() => navigate('/projects')}>Скасувати</CancelButton>
                <SaveButton type='submit' disabled={isSubmitting} />
              </Box>
            </form>
          )
        },
        {
          label: 'Сторінка проєкту',
          content: (
            <><BlocksComposition data={{ blocks: [] }} allowedBlocks={projectBlocks} /></>
          )
        }
      ]} />


    </Box>
  )
}

export default ProjectForm