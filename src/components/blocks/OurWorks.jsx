import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Box, Popover, Typography, Chip, Grid, Tooltip, IconButton } from '@mui/material';
import AddButton from '../common/AddButton';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getImageSrc } from '../../services/storage-service';
import ErrorMessage from '../common/ErrorMessage';

const OurWorks = ({
  registerName,
  control,
  projects,
  errors
}) => {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: `${registerName}.projects`, control: control, rules: {
      validate: {
        length: (value) => value.length == 3
      }
    }
  })
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddProject = (project) => {
    if (project.id) {
      append({ value: project })
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const availableOptions = projects
    .filter(p => !fields.find(project => project.value.id == p.id));

  console.log(errors);
  return (
    <>
      <Grid container>
        {(fields ?? []).map(({ value: s, id }, idx) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Box
                padding={1}
                bgcolor='white'
              >
                <img
                  src={getImageSrc(s.image)}
                  alt={s.title}
                  style={{
                    borderRadius: 5,
                    width: '100%',
                    backgroundColor: '#BABABA',
                    minHeight: '103px'
                  }}
                />
                <Box marginTop={1} display='flex' flexWrap='nowrap' justifyContent='space-between' alignItems='center'>
                  <Typography
                    fontSize='16px'
                    fontWeight={500}
                    color='var(--theme-color)'
                    textAlign='center'
                    lineHeight='30px'
                    marginLeft={1}
                    component={'h3'}

                    style={{
                      WebkitLineClamp: 1,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      cursor: 'default'
                    }}
                  >
                    {s.title}
                  </Typography>
                  <Tooltip disableFocusListener title='Видалити слайд'>
                    <IconButton
                      color='error'
                      onClick={() => {
                        remove(idx)
                      }}
                    ><HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
      <Box
        display='flex'
        justifyContent='center'
        marginTop={3}
        alignItems='center'
        position='relative'
      >
        {(availableOptions ?? []).length > 0 && fields.length < 4 && (
          <>
            <AddButton
              label='Додати проєкт'
              onClick={handleOpenModal}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }}>
                Виберіть проєкт
              </Typography>
              <Box
                maxHeight={350}
                display='flex'
                flexDirection='column'
                padding={2}
                style={{
                  gap: 10,
                  overflowY: 'auto'
                }}
              >
                {availableOptions
                  .map((o) => (
                    <Chip
                      key={o.id}
                      className='slide-option'
                      onClick={() => {
                        handleAddProject(o);
                        handleClose()
                      }}
                      label={o.title ?? o.name ?? o.label}
                    />
                  ))}
              </Box>
            </Popover>
          </>
        )}

        {errors?.projects?.root?.type == 'length' && (
          <ErrorMessage type='projectsLength' length={3} />
        )}
      </Box>
    </>
  )
}

export default OurWorks;