import React, { useState, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form';

import AddButton from '../common/AddButton';
import { Box, Popover, IconButton, Tooltip, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { default as SlickSlider } from 'react-slick';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getProjects } from '../../services/portfolio-api-service';
import { getImageSrc } from '../../services/storage-service.js';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.scss';
const dataOptions = [
	{ value: 'projects', label: 'Проєкти' },
	{ value: 'services', label: 'Послуги' },
	{ value: 'offers', label: 'Сезонні пропозиції' },
]
const Slider = ({ form }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [dataSelected, setDataSelected] = useState(dataOptions[0].value);
	const [projects, setProjects] = useState([]);
	const [selectedSlides, setSelectedSlides] = useState([]);

	const handleOpenModal = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const { control, setValue } = form;

	const {
		fields: slidesFields,
		append: appendSlide,
		remove: removeSlide,
	} = useFieldArray({ control: control, name: `data.slides` })

	useEffect(() => {
		getProjects()
			.then(data =>
				setProjects((data ?? []).map(p =>
					({ ...p, image: getImageSrc(p.image) })
				)))
	}, [])

	const handleToggleChange = (e, value) => {
		setDataSelected(value)
		setSelectedSlides([])
	}

	const handleAddSlide = (slide) => {
		setSelectedSlides(prev => {
			const slides = [...prev, slide]

			setValue(dataSelected, slides)

			return slides;
		})

	}

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	return (<>
		<div className='slider-block'>
			<div className='toggle-container'>
				<ToggleButtonGroup exclusive value={dataSelected} onChange={handleToggleChange}>
					{dataOptions.map(o => (
						<ToggleButton key={o.value} value={o.value}>{o.label}</ToggleButton>
					))}

				</ToggleButtonGroup>
			</div>
			{selectedSlides?.length == 0
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
						{selectedSlides.map((s, idx) => (
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
											onClick={() => removeSlide(idx)}
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
				onClick={handleOpenModal}
			/>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				overflow='scroll'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Typography sx={{ p: 2 }}>
					Виберіть {dataSelected == 'projects' ? 'проєкт' : null}
				</Typography>
				<Box maxHeight={350} overflow='scroll'>
					{(
						dataSelected == 'projects'
							? projects : [])
						.filter(p => !selectedSlides.find(slide => slide.id === p.id))
						.map((p) => (
							<p
								key={p.id}
								className='slide-option'
								onClick={() => {
									handleAddSlide(p);
									handleClose()
								}}
							>{p.title}</p>
						))}
				</Box>
			</Popover>
		</Box>
	</>)
}

export default Slider