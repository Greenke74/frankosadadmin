import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
	Box,
	Grid,
	Button,
	Modal,
	Select,
	MenuItem,
	FormControl,
	Typography,
	Grow,
	Alert,
	InputLabel
} from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';
import { CancelButton, StyledInputLabel, SuccessButton } from '../common/StyledComponents';

import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { deleteBlock } from '../../services/blocks-api-service';

const BlocksComposition = ({ data, allowedBlocks = [], relatedTo }) => {
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [newBlock, setNewBlock] = useState(0);
	const [initialBlocks, setInitialBlocks] = useState([]);

	const { control, handleSubmit, setValue, reset, watch } = useForm({
		defaultValues: {
			blocks: (data.blocks ?? []).map(b => ({ blockId: b, onSubmit: null })),
		},
		mode: 'onChange'
	})

	const {
		fields: blocksFields,
		append: appendBlock,
		remove: removeBlock,
		move: moveBlock,
		update: updateBlock
	} = useFieldArray({ control: control, name: 'blocks' })

	useEffect(() => {
		reset({
			blocks: (data.blocks ?? [])
				.sort((a,b) => {
					return a.position - b.position
				} )
				.map(b => ({ blockId: b.id, onSubmit: null }))
		})
		setInitialBlocks((data.blocks ?? []).map(b => b.id));
	}, [data])

	const handleChangeIsPublished = (idx, value) => {
		setValue(`blocks.${idx}.is_published`, value);
	}

	const onSubmit = async (data) => {
		setSubmitDisabled(true)

		const newBlocks = (await Promise.all(data.blocks.map(block => block.onSubmit()))).filter(v => Boolean(v));

		const newInitialBlocks = [];

		await Promise.all(initialBlocks.map(initBlock => {
			if (initBlock && !data.blocks.find(b => b.blockId == initBlock)) {
				return deleteBlock(initBlock);
			} else {
				newInitialBlocks.push(initBlock);
			}
		}).filter(d => !!d));

		setInitialBlocks([...newInitialBlocks, ...newBlocks]);

		Swal.fire({
			position: 'top-right',
			icon: 'success',
			title: 'Дані успішно оновлено',
			color: 'var(--theme-color)',
			timer: 3000,
			showConfirmButton: false,
			toast: true,

		}).finally(() => setSubmitDisabled(false));
		setSubmitDisabled(false);
	}

	return (
		<>
			<Box p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
				<Box p={2} paddingY={3} border='.13rem #c0c0c0 dashed' borderRadius='8px'>
					<Grid container spacing={3} direction='column'>
						{blocksFields.map((b, idx) => {
							return (
								<Grid item key={b.id} xs={12} style={{ maxWidth: '100%' }} >
									<Grow in={!isNaN(idx)} appear={!isNaN(idx)} timeout={400}>
										<div>
											<Controller
												name={`blocks.${idx}`}
												control={control}
												render={({ field }) => {
													return (
														<Block
															block={field.value.blockId}
															blockType={field.value.blockType}
															idx={idx}
															move={moveBlock}
															remove={removeBlock}
															update={updateBlock}
															fields={blocksFields}
															setIsPublished={handleChangeIsPublished}
															setOnSubmit={(func) => {
																field.onChange({ ...field.value, onSubmit: func })
															}}
															relatedTo={relatedTo}
															pageId={data.id}
														/>
													)
												}}
											/>
										</div>
									</Grow>
								</Grid>
							)
						})}
					</Grid>
					<Box display='flex' justifyContent='end' marginTop={2} style={{ gap: '25px' }}>
						<Button
							startIcon={<AddIcon />}
							variant='text'
							style={{ textTransform: 'none', color: 'var(--theme-color)', backgroundColor: '#f7f7f7' }}
							onClick={() => setModalOpen(true)}
							sx={{
								padding: '6px 15px !important',
								'& > span': { marginRight: '8px !important' }
							}}
						>
							Додати блок
						</Button>
						<SaveButton type='submit' style={{ height: 'fit-content' }} disabled={submitDisabled} />
					</Box>
				</Box>
			</Box>
			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				sx={{
					'& .MuiBackdrop-root': {
						backdropFilter: 'blur(2px)'
					}
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 800,
						maxWidth: '90%',
						boxShadow: 24,
						pt: 5,
						px: 4,
						pb: 5,
						bgcolor: 'white',
						borderRadius: '8px',
					}}>
					<Typography fontSize={20} mb={2} fontWeight={500}>
						Додайте новий блок
					</Typography>
					<Alert severity='info' sx={{ mb: 2 }}>
						Виберіть блок нижче щоб додати його
					</Alert>
					<FormControl fullWidth >
						<InputLabel shrink htmlFor="blockSelect">
							Новий блок
						</InputLabel>
						<Select
							fullWidth
							id='blockSelect'
							label='Новий блок'
							value={newBlock}
							onChange={(e) => setNewBlock(e.target.value)}
						>
							{allowedBlocks.map(b => (
								<MenuItem key={b.type} value={b.type}>{b.label}</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box sx={{ display: 'flex', justifyContent: 'end', mt: 3, gap: '25px' }}>
						<CancelButton onClick={() => {
							setModalOpen(false);
							setNewBlock(0);
						}}>
							Скасувати
						</CancelButton>
						<SuccessButton onClick={(e) => {
							if (newBlock) {
								try {
									appendBlock({
										blockId: null,
										onSubmit: null,
										blockType: newBlock
									})
									setNewBlock(0);
								} catch {

								}
							}
							setModalOpen(false);
						}}>
							Додати
						</SuccessButton>
					</Box>
				</Box>
			</Modal>
		</>
	)
}

export default BlocksComposition