import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';

import BlocksComposition from '../components/BlocksComposition/index.jsx';

import { blocks, mainPageBlocks } from '../components/blocks/index.js';
import { deleteMainPageBlock, getMainPageBlocks } from '../services/main-page-blocks-service.js';
import { Box } from '@mui/material';
import { beforeBlockDeleting, beforeBlockSubmitting, sortBlocks, submitBlock } from '../helpers/blocks-helpers.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Page from '../components/common/Page.jsx';
import { changesSavedAlert, checkErrorsAlert } from '../services/alerts-service.js';
import { dataTypes } from '../constants/dataTypes.js';

const MainPage = () => {

	const [blocksToDelete, setBlocksToDelete] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm({ blocks: [] });

	const blocksFieldArray = useFieldArray({ name: 'blocks', control: form.control });

	useEffect(() => {
		let mounted = true;

		setIsLoading(true)
		getMainPageBlocks().then(({ data }) => {
			mounted && form.reset({
				blocks: sortBlocks(data).map((b, idx) => {
					const initialBlockState = {
						...b,
						position: idx
					}
					dataTypes.forEach(type => {
						if (b[type] && Array.isArray(b[type])) {
							initialBlockState[type] = b[type].map(i => ({ value: i }))
						}
					})

					return { value: initialBlockState }
				})
			})
			mounted && setIsLoading(false)
		})

		return () => mounted = false;
	}, [])

	const onDeleteBlock = (block) => setBlocksToDelete(prev => [...prev, block])

	const onSubmit = async ({ blocks }) => {
		setIsLoading(true)

		const newBlocksValue = []
		await Promise.all((blocks ?? []).map(async ({ value: block }) => {
			const submitPayload = await beforeBlockSubmitting(block);
			const response = await submitBlock(submitPayload, true);

			newBlocksValue.push({ value: response })
		}))

		await Promise.all((blocksToDelete ?? []).map(async block => {
			if (block.id) {
				await beforeBlockDeleting(block)
				await deleteMainPageBlock(block.id)
			}
		}))

		form.reset({ blocks: newBlocksValue })
		setBlocksToDelete([]);
		setIsLoading(false);

		changesSavedAlert();
	}

	return (
		<>
			<PageHeader
				title='Головна сторінка'
				onSubmit={form.handleSubmit(onSubmit, checkErrorsAlert)}
				submitDisabled={isLoading}
			/>
			<Page>
				<Box padding={2}>
					<BlocksComposition
						fieldArray={blocksFieldArray}
						form={form}
						onDeleteBlock={onDeleteBlock}
						allowedBlocks={mainPageBlocks}
						isMainPage={true}
					/>
					<Box display='flex' justifyContent='end' alignItems='center' marginTop={4} >
					</Box>
				</Box>
			</Page>
		</>
	)
}

export default MainPage