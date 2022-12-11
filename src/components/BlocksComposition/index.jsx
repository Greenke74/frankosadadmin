import React, { useState, useEffect, useRef, createRef, useImperativeHandle, forwardRef, } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
	Box,
	Grid,
	Grow,
} from '@mui/material';
import Block from './Block';
import SaveButton from '../common/SaveButton';
import AddButton from '../common/AddButton';
import BlockModal from './BlockModal';

import { deleteBlock } from '../../services/blocks-api-service';
import { deleteMainPageBlock } from '../../services/main-page-blocks-service';
import { dataTypes } from '../../services/data-types-service';
import Swal from 'sweetalert2';

const BlocksComposition = ({
	blocks,
	allowedBlocks = [],
	isMainPage = false,
}, ref) => {
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [initialBlocks, setInitialBlocks] = useState([]);

	const blocksRef = useRef([]);

	const { control, handleSubmit, reset, getValues } = useForm({
		defaultValues: {
			blocks: (blocks ?? []).map(b => ({ block: b }))
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
				.map(b => {
					const block = {
						...b
					}
					dataTypes.forEach(type => {
						const typeId = type + '_ids';

						if (b[type] && Array.isArray(b[type])) {
							block.projects = b.projects.map(p => ({ value: p }))

							block[typeId] = b.projects.map(p => ({ value: p.id ?? null })).filter(({ value }) => value !== null)
						}
					})
					return {
						block
					}
				})
		})
		mounted && setInitialBlocks((blocks ?? []).map(b => b.id));

		return () => mounted = false;
	}, [blocks])

	if (blocksRef.current.length !== blocksFields.length) {
		blocksRef.current = Array(blocksFields.length)
			.fill()
			.map((_, i) => blocksRef.current[i] || createRef());
	}

	const onSubmit = async ({ blocks }) => {
		setSubmitDisabled(true)

		const validations = await Promise.all((blocksRef.current ?? []).map(async (ref) => {
			return await ref.current.validate()
		}

		))
		if (validations.includes(false)) {

			Swal.fire({
				title: 'Введено некоректні дані',
				timer: 5000,
				icon: 'error',
				showCancelButton: false,
				toast: true,
				position: 'top-right',
				color: 'var(--theme-color)',
				showConfirmButton: false,
			})
			return null;
		}

		const newBlocks = (await Promise.all((blocksRef.current ?? []).map(async (ref) => {
			return await ref.current.onSubmit()
		}
		))).filter(b => b !== null);

		const newInitialBlocks = [];

		await Promise.all(initialBlocks.map(initBlock => {
			if (initBlock && !blocks.find(({ block }) => block.id == initBlock)) {
				const deleteFunc = isMainPage
					? deleteMainPageBlock
					: deleteBlock

				return deleteFunc(initBlock)
			} else {
				newInitialBlocks.push(initBlock);
			}
		}).filter(d => !!d));

		const currentBlocks = [...newInitialBlocks, ...newBlocks];

		setInitialBlocks(currentBlocks);

		setSubmitDisabled(false)
		return currentBlocks ?? [];
	}

	useImperativeHandle(ref, () => ({
		onSubmit: async () => onSubmit(getValues())
	}))

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

													const { element, label } = allowedBlocks.find(b => b.type === field.value.block?.type ?? null);
													if (element) {
														return (
															<Block
																ref={blocksRef.current[idx]}
																block={field.value.block}
																idx={idx}
																move={moveBlock}
																remove={removeBlock}
																update={updateBlock}
																blocksLength={blocksFields.length}
																element={element}
																label={label ?? 'Елемент сторінки'}
																isMainPage={isMainPage}
															/>
														)
													}
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
						{isMainPage && (
							<SaveButton type='submit' style={{ height: 'fit-content' }} disabled={submitDisabled} />
						)}
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

export default forwardRef(BlocksComposition)