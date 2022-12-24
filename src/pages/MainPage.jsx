import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';

import PageHeader from '../components/common/PageHeader.jsx';
import Page from '../components/common/Page.jsx';
import BlocksComposition from '../components/BlocksComposition/index.jsx';
import { Box } from '@mui/material';

import { mainPageBlocks } from '../components/blocks/index.js';

import { getMainPageBlocks } from '../services/main-page-blocks-service.js';
import { dataTypes } from '../constants/dataTypes.js';
import { sortBlocks, submitBlocks } from '../helpers/blocks-helpers.js';
import { changesSavedAlert, checkErrorsAlert } from '../services/alerts-service.js';

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

	const onSubmit = async ({ blocks: formBlocks }) => {
		setIsLoading(true)

		const blocks = await submitBlocks(formBlocks, blocksToDelete, true)

		form.reset({ blocks: blocks })
		setBlocksToDelete([]);
		setIsLoading(false);

		changesSavedAlert();
	}

	return (
		<>
			<PageHeader
				title='Головна сторінка'
				onSubmit={form.handleSubmit(onSubmit, (e) => { checkErrorsAlert() })}
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