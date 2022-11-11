import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Box, Grid, Button } from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';

import AddIcon from '@mui/icons-material/Add';

const BlocksComposition = ({ data }) => {
	const { control, watch, handleSubmit, setValue, getValues, reset } = useForm({
		defaultValues: {
			blocks: data.blocks ?? [],
			pageName: data.name
		},
		mode: 'onChange',

	})
	const onSubmit = (data, blockId) => {
		// post/put block
	}
	const {
		fields: blocksFields,
		append: appendBlock,
		remove: removeBlock,
		move: moveBlock,
	} = useFieldArray({ control: control, name: 'blocks' })

	useEffect(() => {
		reset({
			blocks: data.blocks ?? [],
			pageName: data.name
		})
	}, [data])

	const handleChangeIsPublished = (idx, value) => {
		setValue(`blocks.${idx}.is_published`, value);
	}


	return (
		<Box p={2}>
			<Box p={2} paddingY={3} border='.13rem #c0c0c0 dashed' borderRadius='8px'>
				<Grid container spacing={3} direction='column'>
					{blocksFields.map((b, idx) => (
						<Grid item key={b.id} xs={12} style={{ maxWidth: '100%' }} >
							<Controller
								name={`blocks.${idx}`}
								control={control}
								render={({ field }) => {
									return (
										<Block
											block={field.value}
											idx={idx}
											move={moveBlock}
											remove={removeBlock}
											fields={blocksFields}
											setIsPublished={handleChangeIsPublished}
											onSubmit={onSubmit}
										/>
									)
								}}
							/>
						</Grid>
					))}
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
					<SaveButton style={{ height: 'fit-content' }} />
				</Box>
			</Box>
		</Box>
	)
}

export default BlocksComposition