import React, { useState, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form';

import AddButton from '../common/AddButton';
import { Box, Popover, IconButton, Tooltip, Typography, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';
import { default as SlickSlider } from 'react-slick';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getProjects } from '../../services/portfolio-api-service';
import { getImageSrc } from '../../services/storage-service.js';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
		fields: projectFields,
		append: appendProject,
		remove: removeProject
	} = useFieldArray({ name: 'project_ids', control: control })

	const {
		fields: offerFields,
		append: appendOffer,
		remove: removeOffer
	} = useFieldArray({ name: 'offer_ids', control: control })

	const {
		fields: serviceFields,
		append: appendService,
		remove: removeService
	} = useFieldArray({ name: 'service_ids', control: control })

	useEffect(() => {
		Promise.all([
			getProjects()
		])
			.then(([projectsResponse]) => {
				setProjects(projectsResponse ?? [])

				const blockProjects = form.getValues('projects');
				const blockOffers = form.getValues('offers');
				const blockServices = form.getValues('services');

				if ((blockProjects ?? []).length > 0) {
					setDataSelected(dataOptions.find(o => o.value == 'projects'))
					setSelectedSlides(prev => ([
						...prev,
						...blockProjects
					]))

				} else if ((blockOffers ?? []).length > 0) {
					setDataSelected(dataOptions.find(o => o.value == 'offers'))
					setSelectedSlides(prev => ([
						...prev,
						...blockOffers
					]))

				} else if ((blockServices ?? []).length > 0) {
					setDataSelected(dataOptions.find(o => o.value == 'services'))
					setSelectedSlides(prev => ([
						...prev,
						...blockServices
					]))

				}
			})

	}, [])

	const handleToggleChange = (e, value) => {
		setDataSelected(value)
		setSelectedSlides([])
	}

	const handleAddSlide = (slide) => {
		if (slide.id) {
			appendProject(slide.id)
			setSelectedSlides(prev => ([...prev, slide]))
		}
	}

	const handleDeleteSlide = (id) => {
		removeProject(proje)
		setSelectedSlides(prev => {
			const slides = (prev ?? []).filter(s => s.id != id)

			setValue(dataSelected, slides.map(s => s.id))

			return slides;
		})

	}

	console.log(selectedSlides);

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
											onClick={() => {
												handleDeleteSlide(s.id)
											}}
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
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Typography sx={{ p: 2 }}>
					Виберіть {dataSelected == 'projects' ? 'проєкт' : null}
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
					{(
						dataSelected == 'projects'
							? projects : [])
						.filter(p => !selectedSlides.find(slide => slide.id === p.id))
						.map((p) => (
							<Chip
								key={p.id}
								className='slide-option'
								onClick={() => {
									handleAddSlide(p);
									handleClose()
								}}
								label={p.title}
							/>
						))}
				</Box>
			</Popover>
		</Box>
	</>)
}

export default Slider