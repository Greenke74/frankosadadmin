import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';

import AddButton from '../common/AddButton';
import { Box, Popover, IconButton, Tooltip, Typography } from '@mui/material';
import { default as SlickSlider } from 'react-slick';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.scss';

const Slider = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleAddSlide = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const { control, handleSubmit } = useForm({
		defaultValues: {
			services: [

			],
			completed_objects: [],
			offers: []
		},
		mode: 'onChange',

	})

	const {
		fields: servicesFields,
		move: moveService,
		append: appendService,
		remove: removeService,
		swap: swapServices,
	} = useFieldArray({ control: control, name: 'services' })

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	return (<>
		<div className='slider-block'>

			{servicesFields?.length == 0
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
						{servicesFields.map((s, idx) => (
							<Box
								key={s.id}
								flexGrow='1'
								padding={1}
								// margin={1}
								bgcolor='white'
								flexShrink='0'
							>
								<img
									src={s.image}
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
											onClick={() => removeService(idx)}
										><HighlightOffIcon />
										</IconButton>
									</Tooltip>
								</Box>
							</Box>
						))}
					</SlickSlider>
				)}
		</div>
		<Box
			display='flex'
			justifyContent='space-between'
			marginTop={3}
			alignItems='center'
			position='relative'
		>
			<AddButton
				label='Додати слайд'
				onClick={handleAddSlide}
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
				<Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
			</Popover>
		</Box>
	</>)
}

export default Slider