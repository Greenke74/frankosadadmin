import React, { useState } from 'react'


import AddButton from './AddButton.jsx';
import { Box, Popover, IconButton, Tooltip, Typography, Chip } from '@mui/material';
import { default as SlickSlider } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../styles/slider.scss';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getImageSrc } from '../../services/storage-service.js';
import { useFieldArray } from 'react-hook-form';

const Slider = ({
  options, dataType,
  registerName,
  control
}) => {
  
  const {
    fields: slidesFields,
    append: appendSlide,
    remove: removeSlide,
  } = useFieldArray({ name: `${registerName}.${dataType}`, control: control, rules: { minLength: 1 } })
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddSlide = (slide) => {
    if (slide.id) {
      appendSlide({ value: slide })
    }
  }

  const handleDeleteSlide = (idx) => {
    removeSlide(idx);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const availableOptions = options
    .filter(o => !slidesFields.find(slide => slide.value.id == o.id));

  return (<div className='slider-block'>
    {(slidesFields ?? []).length == 0
      ? (
        <Box bgcolor='white' borderRadius={2} display='flex' justifyContent='center' flexDirection='column'>
          <Typography
            color='#BABABA'
            textAlign='center'
            fontSize='22px'
            fontWeight={600}
          >
            Слайдів немає
          </Typography>
          <Typography
            color='#BABABA'
            textAlign='center'
            fontSize='14px'
            fontWeight={400}
            marginTop={1}
          >
            Додайте щонайменше 1 слайд до блока
          </Typography>
        </Box>
      ) : (
        <SlickSlider
          slidesToShow={2}
          infinite={false}
          dots={true}
          draggable={false}
          responsive={[
            {
              breakpoint: 2100,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4
              }
            },
            {
              breakpoint: 1100,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3
              }
            },
            {
              breakpoint: 850,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]}
        >
          {(slidesFields ?? []).map(({ value: s, id }, idx) => {
            return (
              <Box
                key={s.id}
                flexGrow='1'
                padding={1}
                margin={1}
                bgcolor='white'
                flexShrink='0'
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
                        handleDeleteSlide(idx)
                      }}
                    ><HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}

        </SlickSlider>)}
    {(availableOptions ?? []).length > 0 && (

      <Box
        display='flex'
        justifyContent='space-between'
        marginTop={3}
        alignItems='center'
        position='relative'
      >
        <AddButton
          label='Додати слайд'
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
            Виберіть {dataType == 'projects' ? 'проєкт' : dataType == 'services' ? 'послугу' : 'сезонну пропозицію'}
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
                    handleAddSlide(o);
                    handleClose()
                  }}
                  label={o.title ?? o.name ?? o.label}
                />
              ))}
          </Box>
        </Popover>
      </Box>
    )}
  </div>)
}


export default Slider