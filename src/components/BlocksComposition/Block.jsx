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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import Swal from 'sweetalert2';
import '../../styles/swal.css';
import './block.css';
import { getBlock } from '../../services/blocks-api-service';
import { blocks } from '../blocks';
import { Spinner } from '../common/StyledComponents';

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

const Block = ({ block, idx, remove, fields, move, onSubmit }) => {
	const [expanded, setExpanded] = useState(null);
	const [loading, setLoading] = useState(false);
	const [blockData, setBlockData] = useState({});
	const [Element, setElement] = useState(null);

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

	useEffect(() => {
		let mounted = true;
		mounted && setLoading(true);

		getBlock(block).then(data => {
			mounted && setBlockData(data);
			mounted && setElement(lazy(blocks.find(b => b.type === data?.type ?? null).element))
			const { is_published, data: bdata, completed_projects, offers, services } = data;
			mounted && form.reset({ is_published, data: bdata, completed_projects, offers, services })
		})
			.catch(e => console.error(e))
			.finally(() => {
				mounted && setLoading(false);
			})
		return () => mounted = false;
	}, [block])

	return loading
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
						</Typography>
					</AccordionSummary>
					<Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' bgcolor='#f7f7f7'>
						<Tooltip title={is_published ? 'Опубліковано' : 'Приховано'}>
							<IconButton
								size='small'
								onClick={() => { form.setValue('is_published', !is_published) }}
							>
								{is_published
									? <VisibilityIcon style={{ fontSize: '20px', color: 'var(--theme-color)' }} />
									: <VisibilityOffIcon style={{ fontSize: '20px', }} />}
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
				{blockData && <AccordionDetails>
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