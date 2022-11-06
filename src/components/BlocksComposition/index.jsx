import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Box, Grid, Button } from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';

import AddIcon from '@mui/icons-material/Add';

const BlocksComposition = ({ blocks, setBlocks }) => {
	const { control, watch, handleSubmit, setValue, getValues } = useForm({
		defaultValues: {
			blocks: blocks,
			pageName: ''
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

	const handleChangeIsPublished = (idx, value) => {
		setValue(`blocks.${idx}.is_published`, value);
	}
	const blockss = watch('blocks');

	return (
		<Box p={2}>
			<Box p={2} paddingY={3} border='.13rem #c0c0c0 dashed' borderRadius='8px'>
				<Grid container spacing={3} direction='column'>
					{blocksFields.map((b, idx) => (
						<Grid item key={b.id} xs={12} style={{ maxWidth: '100%' }} >
							<Controller
								name={`blocks.${idx}`}
								control={control}
								render={({ field }) => (
									<Block
										block={field.value}
										idx={idx}
										move={moveBlock}
										remove={removeBlock}
										fields={blocksFields}
										isPublished={field.value.is_published}
										setIsPublished={handleChangeIsPublished}
										onSubmit={onSubmit}
									/>
								)}
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