import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Box, Grid, Button } from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';

import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

const BlocksComposition = ({ data }) => {
	const [submitDisabled, setSubmitDisabled] = useState(false);	
	const { control, handleSubmit, setValue, reset } = useForm({
		defaultValues: {
			blocks: (data.blocks ?? []).map(b => ({ id: b, onSubmit: null })),
			pageName: data.name
		},
		mode: 'onChange'
	})
	const {
		fields: blocksFields,
		append: appendBlock,
		remove: removeBlock,
		move: moveBlock,
	} = useFieldArray({ control: control, name: 'blocks' })

	useEffect(() => {
		reset({
			blocks: (data.blocks ?? []).map(b => ({ id: b, onSubmit: null })),
			pageName: data.name
		})
	}, [data])

	const handleChangeIsPublished = (idx, value) => {
		setValue(`blocks.${idx}.is_published`, value);
	}

	const onSubmit = async (data) => {
		setSubmitDisabled(true)
		await Promise.all(data.blocks.map(b => b.onSubmit()))
		Swal.fire({
			position: 'top-right',
			icon: 'success',
			title: 'Дані успішно оновлено',
			color: 'var(--theme-color)',
			timer: 3000,
			showConfirmButton: false,
			toast: true,
		}).then(() => setSubmitDisabled(false));
	}

	return (
		<Box p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
			<Box p={2} paddingY={3} border='.13rem #c0c0c0 dashed' borderRadius='8px'>
				<Grid container spacing={3} direction='column'>
					{blocksFields.map((b, idx) => {
						return (
							<Grid item key={b.id} xs={12} style={{ maxWidth: '100%' }} >
								<Controller
									name={`blocks.${idx}`}
									control={control}
									render={({ field }) => {
										return (
											<Block
												block={field.value.id}
												idx={idx}
												move={moveBlock}
												remove={removeBlock}
												fields={blocksFields}
												setIsPublished={handleChangeIsPublished}
												setOnSubmit={(func) => field.onChange({ ...field.value, onSubmit: func })}
											/>
										)
									}}
								/>
							</Grid>
						)
					})}
				</Grid>
				<Box display='flex' justifyContent='end' marginTop={2} style={{ gap: '25px' }}>
					<Button
						startIcon={<AddIcon />}
						variant='text'
						style={{ textTransform: 'none', color: 'var(--theme-color)', backgroundColor: '#f7f7f7' }}
						onClick={() => appendBlock({ type: 'some block' })}
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
	)
}

export default BlocksComposition