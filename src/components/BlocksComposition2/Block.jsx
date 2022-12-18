import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Box, ButtonGroup, Button, Typography, IconButton, Tooltip, Modal, Fade } from '@mui/material'

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Swal from 'sweetalert2';
import '../../styles/swal.scss';
import './block.css';
import { insertBlock, updateBlock } from '../../services/blocks-api-service';

import IsPublished from '../common/IsPublished';
import { insertMainPageBlock, updateMainPageBlock } from '../../services/main-page-blocks-service';
import { StyledLinearProgress } from '../common/StyledComponents';
import { dataTypes } from '../../services/data-types-service';
import ErrorMessage from '../common/ErrorMessage';
import { useForm } from 'react-hook-form';
import SaveButton from '../common/SaveButton';

const Block = (
  {
    block,
    idx,
    blocksLength,
    move,
    allowedBlocks,
    isMainPage,
    update,
    onInsertBlock = null,
    onDeleteBlock = null
  },
) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [Element, setElement] = useState(null);
  const [valid, setValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { is_published } = block

  const form = useForm({
    defaultValues: block,
    mode: 'onChange'
  })

  const onClose = () => !isSubmitting && setOpen(false);

  useEffect(() => {
    let mounted = true;

    const { label: l, element } = allowedBlocks.find(bl => bl.type == block.type)
    mounted && setElement(lazy(element))
    mounted && setLabel(l);

    return () => mounted = false;
  }, [])

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    let isValid = true;

    if (Object.keys(form.formState.errors ?? {}).length > 0) {

      isValid = false;
    } else {
      isValid = await form.trigger(Object.keys(form.getValues() ?? {}))
    }
    setValid(isValid)
    if (!isValid) {
      setIsSubmitting(false)
      return null;
    }

    const payload = {
      ...formData,
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

    if (!formData.id && block.type) {
      payload.type = block.type;
    }

    const func = isMainPage
      ? payload.id
        ? updateMainPageBlock
        : insertMainPageBlock
      : payload.id
        ? updateBlock
        : insertBlock

    const response = await func(payload)
    const { data } = response;

    update(idx, {
      block: {
        ...formData,
        id: data?.id ?? payload.id,
        type: block.type,
      }
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

  const invalidForm = !valid || Object.keys(form.formState.errors ?? {}).length > 0;
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
        }}
      >
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
            fontWeight={500}
            lineHeight='20px'
          >
            {label}
          </Typography>
          {invalidForm && (
            <ErrorMessage type='invalidForm' />
          )}
        </Box>
        <Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' >
          <Tooltip title={is_published ? 'Опубліковано' : 'Приховано'}>
            <IconButton
              size='small'
              onClick={() => { form.setValue('is_published', !is_published) }}
            >
              <IsPublished isPublished={is_published} />
            </IconButton>
          </Tooltip>
          <ButtonGroup>
            <Button
              disableRipple={true}
              onClick={() => move(idx, idx + 1)}
              disabled={idx + 1 == blocksLength}
            ><ArrowCircleDownIcon />
            </Button>
            <Button
              disableRipple={true}
              onClick={() => move(idx, idx - 1)}
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
      </Box>
      <Modal
        open={open}
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(3px) !important'
          },
          overflow: 'hidden'
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
            padding: 1,
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
                />
              </Box>
            </Suspense>
            <Box sx={{ width: '100%', bgcolor: 'white', display: 'flex', justifyContent: 'end'   }}>
              <SaveButton disabled={isSubmitting} onClick={async () => await onSubmit(form.getValues())} style={{ height: 'fit-content' }} />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default Block