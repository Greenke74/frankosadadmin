import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import {
  Box,
  Alert,
  Card,
  FormControl,
  FormControlLabel,
  Grid, IconButton,
  Typography,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';

import { StyledCheckbox, StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents';
import ImageUploader from '../components/common/ImageUploader';
import ErrorMessage from '../components/common/ErrorMessage';
import Tabs from '../components/common/Tabs';
import BlocksComposition from '../components/BlocksComposition';

import { CameraAlt, Delete } from '@mui/icons-material';

import { getProjectPage, insertProject, updateProject } from '../services/portfolio-api-service';
import { getSrcFromFile } from '../helpers/file-helpers';
import { deleteImage, getImageSrc, uploadImage } from '../services/storage-service.js';
import { slugify } from 'transliteration';
import Swal from 'sweetalert2';
import { projectBlocks } from '../components/blocks/index.js';
import { changesSavedAlert, checkErrorsAlert } from '../services/alerts-service';
import { sortBlocks, submitBlocks } from '../helpers/blocks-helpers';
import Page from '../components/common/Page';
import PageHeader from '../components/common/PageHeader';
import TabPanel from '../components/common/TabPanel';
import { v1 as uuid } from 'uuid'
import ImageDeleteButton from '../components/common/ImageDeleteButton';

const projectTypes = ['Приватний будинок', 'Житловий комплекс', 'Підприємство']
const IMAGE_ASPECT_RATIO = 2 / 1;

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const [imageToDelete, setImageToDelete] = useState(null);
  const [blocksToDelete, setBlocksToDelete] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const form = useForm({
    defaultValues: {
      title: '',
      location: '',
      type: '',
      alias: '',
      image: {
        image: '',
        imageSrc: '',
        imageFile: null
      },
      is_published: true,
      completed_at: new Date().toISOString().substr(0, 10),
      blocks: []
    },
    mode: 'onSubmit'
  })
  const { reset, getValues, setValue, watch, handleSubmit, register, formState: { errors }, control } = form;

  const blocksFieldArray = useFieldArray({ control: control, name: 'blocks' })


  const is_published = watch('is_published')

  useEffect(() => {
    let mounted = true;
    !isNaN(id) && getProjectPage(id).then(({ data: project }) => {
      const formData = {
        ...getValues(),
        ...project,
        completed_at: project.completed_at.substr(0, 10),
        image: {
          image: project.image,
          imageSrc: '',
          imageFile: null
        },
        blocks: sortBlocks(project.blocks ?? []).map(b => ({ value: b }))
      }
      reset(formData);
      mounted && setInitialValues(formData);
    })

    return () => mounted = false;
  }, [id])

  const onDeleteBlock = (block) => setBlocksToDelete(prev => [...prev, block])

  const onSubmit = async (data) => {
    const { blocks: formBlocks } = data;
    setIsSubmitting(true)

    const blocks = await submitBlocks(formBlocks, blocksToDelete, imagesToDelete)

    const { title } = data;

    const payload = {
      ...initialValues,
      ...data,
      alias: slugify(title.trim()?.slice(0, 75), { replace: [['.', '-']] }),
      blocks_ids: blocks.map(b => b.value.id)
    }

    let imageKey = null;
    if (data?.image?.imageFile) {
      imageKey = await uploadImage(data.image?.imageFile)
      await deleteImage(imageToDelete)

      delete payload.imageFile;
      payload.image = imageKey;
    } else {
      payload.image = payload.image.image;
    }

    if (JSON.stringify(payload) !== JSON.stringify(initialValues)) {
      delete payload.blocks

      try {
        if (payload.id) {
          await updateProject(payload);

          setValue('imageFile', null);

          changesSavedAlert();
        } else {
          const { data: { id } } = await insertProject(payload);
          setValue('imageFile', null);

          navigate(`/projects/${id}`);
          changesSavedAlert();
        }
      } catch (error) {
        if (error?.includes('duplicate key value violates unique constraint')) {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Проєкт з такою назвою уже існує!',
            color: 'var(--theme-color)',
            timer: 5000,
            showConfirmButton: false,
            toast: true,
          })
        }
        if (imageKey) {
          await deleteImage(imageKey);
        }
        return;
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
      }
      if (imageToDelete) {
        await deleteImage(imageToDelete);
        setImageToDelete(null);
      }

      delete payload.blocks_ids;
      const newFormData = {
        ...payload,
        image: {
          image: payload.image ?? data.image,
          imageSrc: '',
          imageFile: null
        },
        blocks: blocks
      }
      setInitialValues(newFormData);
      form.reset(newFormData);

      setBlocksToDelete([]);
      setImagesToDelete([]);

      setIsSubmitting(false);
    }
  }

  const onError = (errors) => {
    const generalInfoErrors = { ...errors };
    if (generalInfoErrors?.blocks) {
      delete generalInfoErrors.blocks;
    }
    setCurrentTab(Object.keys(generalInfoErrors).length > 0 ? 0 : 1)
    checkErrorsAlert()
  }

  const appendImageToDelete = (id) => setImagesToDelete(prev => ([...prev, id]))

  const generalInfoErrors = { ...errors };
  if (generalInfoErrors?.blocks) {
    delete generalInfoErrors.blocks;
  }


  return (
    <>
      <PageHeader
        title={isNaN(id)
          ? 'Створення нового об\'єкта портфоліо'
          : 'Редагування об\'єкта портфоліо'}
        onSubmit={handleSubmit(onSubmit, onError)}
        submitDisabled={isSubmitting}
        onGoBack={() => navigate('/projects')}
      />
      <Page>
        <Box padding={2}>
          <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={[
            {
              label: 'Загальна інформація',
              errors: generalInfoErrors
            },
            {
              label: 'Сторінка проєкту',
              errors: errors?.blocks
            }
          ]} >
            <TabPanel index={0} currentTab={currentTab}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', pb: 1 }}>
                    <StyledInputLabel required shrink htmlFor='imageUploader' sx={{ alignSelf: 'start' }}>
                      Зображення
                    </StyledInputLabel>
                    <Controller
                      name={`image`}
                      control={control}
                      rules={{ validate: (value) => value?.image ? Boolean(value.image) : Boolean(value.imageUrl) || 'imageRequired' }}
                      render={({ field }) => {
                        return (
                          <>
                            <Box sx={{
                              mt: 3,
                              maxWidth: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              position: 'relative'
                            }}>
                              {(field.value.imageUrl || field.value.image) && (
                                <ImageDeleteButton onClick={() => {
                                  field.value.image && setImageToDelete(field.value.image)
                                  field.onChange({
                                    ...field.value,
                                    imageFile: null,
                                    imageSrc: '',
                                    image: ''
                                  })
                                }} />
                                // <Tooltip title='Видалити зображення'>
                                //   <IconButton
                                //     sx={{
                                //       position: 'absolute',
                                //       top: -18,
                                //       right: -18,
                                //     }}
                                //     onClick={() => {
                                //       field.value.image && setImageToDelete(field.value.image)
                                //       field.onChange({
                                //         imageFile: null,
                                //         imageSrc: '',
                                //         image: ''
                                //       })
                                //     }}
                                //   >
                                //     <Delete sx={{ color: 'var(--error)' }} />
                                //   </IconButton>
                                // </Tooltip>
                              )}
                              <Card sx={{ boxShadow: errors?.image?.message == 'imageRequired' ? '0px 0px 3px 0px red' : undefined, width: '315px', display: 'flex' }}>
                                {(field.value.imageUrl || field.value.image)
                                  ? (<>
                                    <img style={{ maxWidth: '100%' }} src={field.value.imageUrl ?? getImageSrc(field.value.image)} />
                                  </>)
                                  : (<Box sx={{ width: '315px', height: '135.5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></Box>)}
                              </Card>
                            </Box>
                            <Box sx={{ mb: 2, mt: 1, width: '315px' }}>
                              {errors && errors.image && (
                                <ErrorMessage type='imageRequired' />
                              )}
                            </Box>
                            <ImageUploader
                              id={`${uuid()}-image-uploader`}
                              ratio={IMAGE_ASPECT_RATIO}
                              onChange={async (file) => {
                                field.onChange({
                                  ...field.value,
                                  image: null,
                                  imageUrl: await getSrcFromFile(file),
                                  imageFile: file,
                                })


                              }}
                              buttonDisabled={field.value.imageUrl || field.value.image}
                            />
                          </>
                        )
                      }}
                    />

                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel index={1} currentTab={currentTab}>
              <BlocksComposition
                fieldArray={blocksFieldArray}
                allowedBlocks={projectBlocks}
                form={form}
                onDeleteBlock={onDeleteBlock}
                appendImageToDelete={appendImageToDelete}
              />
            </TabPanel>
          </Tabs>
        </Box>
      </Page>
    </>
  )
}

export default ProjectForm