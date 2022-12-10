import React, { useState, useEffect, lazy, useImperativeHandle, forwardRef, Suspense, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { Box, ButtonGroup, Button, Typography, styled, IconButton, Tooltip } from '@mui/material'
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
import { insertBlock, updateBlock } from '../../services/blocks-api-service';

import IsPublished from '../common/IsPublished';
import { insertMainPageBlock, updateMainPageBlock } from '../../services/main-page-blocks-service';
import { StyledLinearProgress } from '../common/StyledComponents';
import { dataTypes } from '../../services/data-types-service';

const Block = ({ block, idx, remove, blocksLength, move, update, element, label, isMainPage }, ref) => {
	const [expanded, setExpanded] = useState(null);
	const [Element, setElement] = useState(null);
	const blockRef = useRef(null);

	const form = useForm({
		defaultValues: block,
		mode: 'onChange'
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

		if (data?.id) {
			return data.id;
		}

		return null;
	}

	useImperativeHandle(ref, () => ({ onSubmit: async () => await onSubmit(blockRef.current.getBlockData()) }))

	useEffect(() => {
		let mounted = true;

		mounted && setElement(forwardRef(lazy(element)));

		return () => mounted = false;
	}, [element])

	return (
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
							onClick={onDelete}
						><HighlightOffIcon />
						</Button>
					</ButtonGroup>
				</Box>
			</Box>
			<AccordionDetails >
				<Box className='block-settings' marginY={2}>
					{Element ? (
						<Suspense fallback={<StyledLinearProgress />}>
							<Element
								form={form}
								ref={blockRef}
							/>
						</Suspense>
					) : null}
				</Box>
			</AccordionDetails>
		</Accordion >
	)
}

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


export default forwardRef(Block)