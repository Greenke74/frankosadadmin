import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useForm } from 'react-hook-form';
import { Box, ButtonGroup, Button, Typography, styled, IconButton, Tooltip, Fade } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Swal from 'sweetalert2';
import '../../styles/swal.scss';
import './block.css';
import { getBlock, insertBlock, updateBlock } from '../../services/blocks-api-service';
import { blocks } from '../blocks';
import IsPublished from '../common/IsPublished';

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	maxWidth: '100%',
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	flexGrow: 1,
	height: '56px',
	paddingTop: 6,
	paddingBottom: 6,
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Block = ({ block, blockType, idx, remove, fields, move, setOnSubmit, relatedTo, pageId, update }) => {
	const [expanded, setExpanded] = useState(null);
	const [loading, setLoading] = useState(false);
	const [blockData, setBlockData] = useState({});
	const [Element, setElement] = useState(null);
	const [label, setLabel] = useState('');
	const [error, setError] = useState(false);

	const form = useForm({
		defaultValues: {
			is_published: true,
			data: null,
			completed_projects: null,
			offers: null,
			services: null
		}
	})
	const is_published = form.watch('is_published');

	const onDelete = () => {
		Swal.fire({
			title: 'Видалити блок',
			html: 'Ви впевнені, що хочете видалити блок?',
			showCancelButton: true,
			cancelButtonText: 'Скасувати',
			confirmButtonText: 'Так',
			focusCancel: true,
			customClass: 'logoutSwal'
		}).then(result => {
			if (result.value) {
				remove(idx);
			}
		})
	}
	const onSubmit = async (formData) => {
		const { id, type_id, data_from } = blockData
		const payload = {
			id: id,
			is_published: formData.is_published,
			type_id,
			data_from,
			related_to: relatedTo,
			data: formData?.data ?? null,
			position: idx,
		};
		if (!id && blockType) {
			payload.type = blockType;
		}
		if (relatedTo == 'page' && pageId) {
			payload.page_id = pageId
		}
		if (data_from === 'offers') {
			payload.offer_ids = formData?.offers?.map(o => o.id) ?? [];
		}
		else if (data_from === 'completed_projects') {
			payload.completed_project_ids = formData?.offers?.map(o => o.id) ?? [];
		}
		else if (data_from === 'services') {
			payload.service_ids = formData?.services?.map(o => o.id) ?? [];
		}

		if (payload.id) {
			await updateBlock(payload);
		} else {
			const { data } = await insertBlock(payload)
			setBlockData(prev => ({ ...prev, id: data.id }));
			update(idx, { 
				blockId: data.id,
				onSubmit: async () => await onSubmit(form.getValues()),
				blockType
			})

			return data.id;
		}
	}

	useEffect(() => {
		setOnSubmit(async () => await onSubmit(form.getValues()));
	}, [blockData, block, blockType, idx])


	useEffect(() => {
		let mounted = true;
		
		if (block) {
			mounted && setLoading(true);
			getBlock(block).then(data => {
				const b = blocks.find(b => b.type === data?.type ?? null);
				
				mounted && setBlockData(data);
				mounted && setElement(lazy(b.element))
				mounted && setLabel(b.label);

				const { is_published, data: bdata, completed_projects, offers, services, position } = data;
				mounted && form.reset({ is_published, data: bdata, completed_projects, offers, services })
			})
				.catch(e => console.error(e))
				.finally(() => {
					mounted && setLoading(false);
				})
		} else if (blockType) {
			const b = blocks.find(b => b.type === blockType);

			mounted && setBlockData({});
			mounted && setElement(lazy(b.element))
			mounted && setLabel(b.label);
		} else {
			setError(true);
			setLoading(false);
		}
		return () => mounted = false;
	}, [block])

	return error
		? null
		: loading
			? (<div style={{ width: '100%', height: 58, backgroundColor: '#f7f7f7', borderRadius: 4 }}></div>)
			: (
				<Accordion expanded={expanded} >
					<Box
						display='flex'
						width='100%'
						justifyContent='space-between'
						alignItems='center'
						flexWrap='nowrap'
					>
						<AccordionSummary
							onClick={() => setExpanded(prev => !prev)}
						>
							<Typography
								component="h3"
								fontSize='14px'
								flexGrow={1}
								flexShrink={0}
								lineHeight='20px'
							>
								{label}
							</Typography>
						</AccordionSummary>
						<Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' bgcolor='#f7f7f7'>
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
									disabled={idx + 1 == fields.length}
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
									onClick={onDelete}
								><HighlightOffIcon />
								</Button>
							</ButtonGroup>
						</Box>
					</Box>
					{blockData && <AccordionDetails >
						<Box className='block-settings' marginY={2}>
							{Element ? (
								<Element form={form} />
							) : null}
						</Box>
					</AccordionDetails>}
				</Accordion >
			)
}

export default Block