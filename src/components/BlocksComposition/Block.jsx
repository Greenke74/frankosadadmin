import React, { useState } from 'react'
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
import { SettingsBlock } from '../blocks';

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
	minHeight: '100% !important',
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

const Block = ({ block, idx, remove, fields, move, onSubmit,isPublished, setIsPublished }) => {
	const [expanded, setExpanded] = useState(null);
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
						{block.type}
					</Typography>
				</AccordionSummary>
				<Box display='flex' flexWrap='nowrap' style={{ gap: '10px' }} alignItems='center' padding='10px' bgcolor='#f7f7f7'>
					<Tooltip title={isPublished ? 'Опубліковано' : 'Приховано'}>
						<IconButton
							size='small'
							onClick={() =>  setIsPublished(idx, !Boolean(isPublished))}
						>
							{isPublished
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
			<AccordionDetails>
				<Box className='block-settings' marginY={2}>
					<SettingsBlock
						type={block.type}
						onSubmit={onSubmit}
					/>
				</Box>
			</AccordionDetails>
		</Accordion >
	)
}

export default Block