import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form';

import { Box, ButtonGroup, Button, Typography, Tooltip, Modal, Fade, Checkbox } from '@mui/material'
import ErrorMessage from '../common/ErrorMessage';
import SaveButton from '../common/SaveButton';
import { StyledLinearProgress } from '../common/StyledComponents';

import { insertBlock, updateBlock } from '../../services/blocks-api-service';
import { insertMainPageBlock, updateMainPageBlock } from '../../services/main-page-blocks-service';
import { dataTypes } from '../../services/data-types-service';
import { changesSavedAlert, checkErrorsAlert, unsavedChanges } from '../../services/alerts-service';

import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  HighlightOff as HighlightOffIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

import '../../styles/swal.scss';
import './block.css';
import { blocks } from '../blocks';
import { beforeBlockSubmitting } from '../../helpers/blocks-helpers';
import { deleteImage } from '../../services/storage-service';

const Block = (
  {
    data,
    idx,
    blocksLength,
    move,
    isMainPage,
    update,
    onInsertBlock = null,
    onDeleteBlock = null,
    onMove = null
  }
) => {
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [Element, setElement] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(data);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const form = useForm({
    defaultValues: data,
    mode: 'onChange'
  })

  useEffect(() => {
    let mounted = true;

    const b = blocks.find(bl => bl.type == data?.type)
    if (!b?.label) {
      mounted && setLabel('Блок сторінки')
    } else {
      mounted && setLabel(b?.label);
    }
    if (!b?.element) {
      mounted && setError(true)
    } else {
      mounted && setElement(lazy(b?.element))
    }

    return () => mounted = false;
  }, [])

  const validateForm = async () => {
    let isValid = true;

    if (Object.keys(form.formState.errors ?? {}).length > 0) {

      isValid = false;
    } else {
      isValid = await form.trigger(Object.keys(form.getValues() ?? {}))
    }

    return isValid;
  }

  const onClose = () => {
    const formData = form.getValues();
    if (JSON.stringify(formData) !== JSON.stringify(initialValues)) {
      unsavedChanges()
        .then((result) => {
          if (result.isDismissed) {
            form.reset(initialValues);

            setOpen(false);
          } else if (result.value) {
            onSubmit(formData).then(() => {

            })
          }
        })
      return;

    };
    !isSubmitting && setOpen(false)
  }


  const onSubmit = async (formData) => {
    if (JSON.stringify(formData) === JSON.stringify(initialValues)) {
      console.log('no changes');
      changesSavedAlert();
      setOpen(false);
      return;
    }

    setIsSubmitting(true);
    let isValid = await validateForm();
    if (!isValid) {
      checkErrorsAlert();
      setIsSubmitting(false)
      return null;
    }

    const payloadData = await beforeBlockSubmitting(formData);

    console.log(formData, payloadData);
    const payload = {
      ...formData,
      ...payloadData,
      data: formData?.data ?? null,
      position: idx,
    };


    dataTypes.forEach(type => {
      if (payload[type]) {
        delete payload[type];
      }
      const ids = `${type}_ids`
      if (payload[ids] && Array.isArray(payload[ids])) {
        payload[ids] = payload[ids].map((id) => id?.value ?? id ?? undefined).filter(id => Boolean(id))
      }
    })

    if (!formData.id && data.type) {
      payload.type = data.type;
    }

    const func = isMainPage
      ? payload.id
        ? updateMainPageBlock
        : insertMainPageBlock
      : payload.id
        ? updateBlock
        : insertBlock

    const response = await func(payload)

    const { data: responseData } = response;

    await Promise.all(imagesToDelete.map(async (id) => await deleteImage(id)))
    setImagesToDelete([]);

    const updatedBlockData = {
      ...formData,
      id: responseData?.id ?? payload.id,
      type: data?.type
    }

    changesSavedAlert();
    setOpen(false);

    setInitialValues(updatedBlockData);
    update(idx, {
      value: updatedBlockData
    })

    if (onInsertBlock !== null && data?.id !== undefined && data?.id !== null) {
      await onInsertBlock(data?.id)
    }

    setIsSubmitting(false)

    if (data?.id) {
      return data.id;
    }

    return null;
  }

  const appendImageToDelete = (id) => setImagesToDelete(prev => ([...prev, id]))

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          border: `1px solid #BABABA`,
          borderRadius: '5px',
          overflow: 'hidden',
          bgcolor: '#f7f7f7',
          minHeight: '64px'
        }}
      >
        {!error ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                cursor: 'pointer',
                pl: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '50px',
                justifyContent: 'center',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => setOpen(true)}
            >
              <Typography
                component="h3"
                fontSize='14px'
                lineHeight='20px'
              >
                {label}
              </Typography>
            </Box>
            <Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' >
              <Controller
                name={`is_published`}
                control={form.control}
                render={({ field }) => {
                  return (
                    <Tooltip title={field.value ? 'Опубліковано' : 'Приховано'}>
                      <Checkbox
                        checked={field.value}
                        onChange={async (event, value) => {
                          event.target.disabled = true;
                          field.onChange(value);
                          await onSubmit(form.getValues())
                          event.target.disabled = false;
                        }}
                        checkedIcon={<VisibilityIcon style={{ fontSize: '20px', color: '#40a471' }} />}
                        icon={<VisibilityOffIcon style={{ fontSize: '20px', }} />}
                      />
                    </Tooltip>

                  )
                }}
              />
              <ButtonGroup>
                <Button
                  disableRipple={true}
                  onClick={() => onMove(idx, idx + 1)}
                  disabled={idx + 1 == blocksLength}
                ><ArrowCircleDownIcon />
                </Button>
                <Button
                  disableRipple={true}
                  onClick={() => onMove(idx, idx - 1)}
                  disabled={idx == 0}
                ><ArrowCircleUpIcon />
                </Button>
                <Button
                  color='error'
                // onClick={onDelete}
                ><HighlightOffIcon />
                </Button>
              </ButtonGroup>
            </Box>
            <Modal
              open={open}
              sx={{
                '& .MuiBackdrop-root': {
                  backdropFilter: 'blur(3px) !important'
                },
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 10
              }}
            >
              <Fade in={open} >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 1100,
                  maxWidth: '90%',
                  maxHeight: '95%',
                  boxShadow: 24,
                  bgcolor: 'white',
                  borderRadius: '8px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  p: 2,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'end', pb: 1 }}>
                    <Button
                      color='error'
                      onClick={onClose}
                      endIcon={<HighlightOffIcon />}
                      sx={{
                        textTransform: 'none',
                        padding: '4px 12px'
                      }}
                    >
                      Закрити
                    </Button>
                  </Box>

                  <Suspense fallback={<StyledLinearProgress sx={{ height: '8px', opacity: '0.6' }} />}>
                    <Box sx={{
                      pt: 2,
                      px: 2,
                    }}>
                      <Element
                        form={form}
                        // imagesToDelete={imagesToDelete}
                        appendImageToDelete={appendImageToDelete}
                      />
                    </Box>
                  </Suspense>
                  <Box sx={{ width: '100%', bgcolor: 'white', display: 'flex', justifyContent: 'end' }}>
                    <SaveButton disabled={isSubmitting} onClick={async () => await onSubmit(form.getValues())} style={{ height: 'fit-content' }} />
                  </Box>
                </Box>
              </Fade>
            </Modal>
          </>
        ) : (
          <Typography
            component="h4"
            fontSize='12px'
            lineHeight='20px'
            sx={{
              pl: 2
            }}
          >Сталася помилка під час завантаження даного блока!
          </Typography>
        )}
      </Box>
    </>
  )
}

export default Block;