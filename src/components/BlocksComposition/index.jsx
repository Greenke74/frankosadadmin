import React, { useState, useEffect, useRef, createRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
	Box,
	Grid,
	Grow,
} from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';
import AddButton from '../common/AddButton';

import Swal from 'sweetalert2';
import { deleteBlock } from '../../services/blocks-api-service';
import BlockModal from './BlockModal';

const BlocksComposition = ({ blocks, allowedBlocks = [], relatedTo }) => {
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [initialBlocks, setInitialBlocks] = useState([]);

	const blocksRef = useRef([]);

	const { control, handleSubmit, setValue, reset, watch } = useForm({
		defaultValues: {
			blocks: blocks.map(b => ({ block: b }))
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
		let mounted = true;
		mounted && reset({
			blocks: (blocks ?? [])
				.sort((a, b) => {
					return a.position - b.position
				})
				.map(b => ({ block: b }))
		})
		mounted && setInitialBlocks((blocks ?? []).map(b => b.id));

		return () => mounted = false;
	}, [blocks])

	if (blocksRef.current.length !== blocksFields.length) {
		blocksRef.current = Array(blocksFields.length)
			.fill()
			.map((_, i) => blocksRef.current[i] || createRef());
	}

	const handleChangeIsPublished = (idx, value) => {
		setValue(`blocks.${idx}.is_published`, value);
	}

	const onSubmit = async ({ blocks }) => {
		setSubmitDisabled(true)

		const newBlocks = (await Promise.all((blocksRef.current ?? []).map((ref) => {
			ref.current.onSubmit()
		}
		))).filter(v => Boolean(v));

		const newInitialBlocks = [];

		await Promise.all(initialBlocks.map(initBlock => {
			if (initBlock && !blocks.find(b => b.blockId == initBlock)) {
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
						{blocksFields.map(({ id }, idx) => {
							return (
								<Grid item key={id} xs={12} style={{ maxWidth: '100%' }} >
									<Grow in={!isNaN(idx)} appear={!isNaN(idx)} timeout={400}>
										<div>
											<Controller
												name={`blocks.${idx}`}
												control={control}
												render={({ field }) => {
													return (
														<Block
															ref={blocksRef.current[idx]}
															block={field.value.block}
															idx={idx}
															move={moveBlock}
															remove={removeBlock}
															update={updateBlock}
															blocksLength={blocksFields.length}
															setIsPublished={handleChangeIsPublished}
															relatedTo={relatedTo}
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
						<AddButton
							label='Додати блок'
							onClick={() => setModalOpen(true)}
						/>
						<SaveButton type='submit' style={{ height: 'fit-content' }} disabled={submitDisabled} />
					</Box>
				</Box>
			</Box>
			<BlockModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				appendBlock={appendBlock}
				allowedBlocks={allowedBlocks}
				blocksLength={blocksFields.length}
			/>
		</>
	)
}

export default BlocksComposition