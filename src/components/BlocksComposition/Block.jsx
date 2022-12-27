import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Controller } from 'react-hook-form';

import { Box, ButtonGroup, Button, Typography, Tooltip, Checkbox } from '@mui/material'
import { Accordion, AccordionSummary } from './BlockAccordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { StyledLinearProgress } from '../common/StyledComponents';

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
import ErrorMessage from '../common/ErrorMessage';

const Block = (
  {
    data,
    idx,
    blocksLength,
    onMoveBlock = null,
    onDeleteBlock = null,
    appendImageToDelete,
    registerName,
    register,
    control,
    getValues,
    formState,
    projects,
    services
  }
) => {

  const errors = formState?.errors &&
    formState?.errors?.blocks &&
    formState?.errors?.blocks[idx] &&
    formState?.errors?.blocks[idx].value

  const invalidData = Object.keys(errors ?? {}).length > 0;

  const [expanded, setExpanded] = useState(invalidData);
  const [error, setError] = useState(false);

  const [label, setLabel] = useState('');
  const [Element, setElement] = useState(null);

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

  useEffect(() => {
    if (invalidData) {
      setExpanded(true);
    }
  }, [invalidData])

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: invalidData ? 'initial' : 'pointer'
          }}
          onClick={() => setExpanded(prev => {
            if (prev) {
              return invalidData
            } else {
              return !prev
            }
          })}
        >
          {!error ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography
                component="h3"
                fontSize='14px'
                lineHeight='20px'
                whiteSpace='nowrap'
              >
                {label}
              </Typography>
              {invalidData && (
                <ErrorMessage type={'invalidForm'} />
              )}
            </Box>
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
        <Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' >
          <Controller
            name={`${registerName}.is_published`}
            control={control}
            render={({ field }) => {
              return (
                <Tooltip title={field.value ? 'Опубліковано' : 'Приховано'}>
                  <Checkbox
                    checked={field.value}
                    onChange={async (event, value) => {
                      field.onChange(value);
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
              onClick={() => onMoveBlock(idx, idx + 1)}
              disabled={idx + 1 == blocksLength}
            >
              <Tooltip title={'Перемістит вниз'}>
                <ArrowCircleDownIcon />
              </Tooltip>
            </Button>
            <Button
              disableRipple={true}
              onClick={() => onMoveBlock(idx, idx - 1)}
              disabled={idx == 0}
            >
              <Tooltip title={'Перемістит вверх'}>
                <ArrowCircleUpIcon />
              </Tooltip>
            </Button>
            <Button
              color='error'
              onClick={() => onDeleteBlock(data)}
            >
              <Tooltip title={'Видалити блок'}>
                <HighlightOffIcon />
              </Tooltip>
            </Button>
          </ButtonGroup>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Suspense fallback={<StyledLinearProgress sx={{ height: '8px', opacity: '0.6' }} />}>
          <Box sx={{
            pt: 2,
            px: 2,
          }}>
            {Element && (
              <Element
                registerName={registerName}
                register={register}
                control={control}
                errors={errors}
                getValues={getValues}
                appendImageToDelete={appendImageToDelete}
                projects={projects}
                services={services}
              />)}
          </Box>
        </Suspense>
      </AccordionDetails>
    </Accordion >
  )
}

export default Block;