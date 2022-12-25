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
  MenuItem
} from '@mui/material';

import { CancelButton, StyledCheckbox, StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents';
import ImageUploader from '../components/common/ImageUploader';
import SaveButton from '../components/common/SaveButton';
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

const projectTypes = ['Приватний будинок', 'Житловий комплекс', 'Підприємство']

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const tabsRef = useRef(null);

  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [blocksToDelete, setBlocksToDelete] = useState([]);

  const form = useForm({
    defaultValues: {
      title: '',
      location: '',
      type: '',
      alias: '',
      image: '',
      imageFile: null,
      is_published: true,
      completed_at: new Date().toISOString().substr(0, 10),
      blocks: []
    },
    mode: 'onSubmit'
  })
  const { reset, getValues, setValue, watch, handleSubmit, register, formState: { errors }, control } = form;

  const blocksFieldArray = useFieldArray({ control: control, name: 'blocks' })


  const is_published = watch('is_published')
  const image = watch('image')

  useEffect(() => {
    let mounted = true;
    !isNaN(id) && getProjectPage(id).then(({ data: project }) => {
      const formData = {
        ...getValues(),
        ...project,
        completed_at: project.completed_at.substr(0, 10),
        image: getImageSrc(project.image),
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

    const blocks = await submitBlocks(formBlocks, blocksToDelete)

    let imageKey = null;

    const { title } = data;

    const payload = {
      ...initialValues,
      ...data,
      alias: slugify(title.trim()?.slice(0, 75), { replace: [['.', '-']] }),
      blocks_ids: blocks.map(b => b.value.id)
    }

    if (data.imageFile) {

      imageKey = await uploadImage(data.imageFile)
      setValue('image', getImageSrc(imageKey));
      setValue('imageFile', null);
      payload.image = imageKey
    } else {
      delete payload.image;
    }

    if (JSON.stringify(payload) !== JSON.stringify(initialValues)) {
      delete payload.imageFile;

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
      await deleteImage(imageToDelete);
      setImageToDelete(null);

      setInitialValues(payload);

      form.reset({ ...payload, blocks: blocks })
      setBlocksToDelete([]);
      setIsSubmitting(false);

      changesSavedAlert();
    }
  }

  const onError = (errors) => {
    const generalInfoErrors = { ...errors };
    if (generalInfoErrors?.blocks) {
      delete generalInfoErrors.blocks;
    }
    tabsRef.current.setTab(Object.keys(generalInfoErrors).length > 0 ? 0 : 1)
    checkErrorsAlert()
  }

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
      />
      <Page>
        <Box padding={2}>
          <Tabs ref={tabsRef} tabs={[
            {
              label: 'Загальна інформація',
              errors: generalInfoErrors
            },
            {
              label: 'Сторінка проєкту',
              errors: errors?.blocks
            }
          ]} >
            <TabPanel>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px', pb: 1 }}>
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
            </TabPanel>
            <TabPanel>
              <BlocksComposition
                fieldArray={blocksFieldArray}
                allowedBlocks={projectBlocks}
                form={form}
                onDeleteBlock={onDeleteBlock}
              />
            </TabPanel>
          </Tabs>
        </Box>
      </Page>
    </>
  )
}

export default ProjectForm