import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';

import BlocksComposition from '../components/BlocksComposition/index.jsx';

import { mainPageBlocks } from '../components/blocks/index.js';
import { getMainPageBlocks } from '../services/main-page-blocks-service.js';
import Swal from 'sweetalert2';
import { Box } from '@mui/material';
import SaveButton from '../components/common/SaveButton.jsx';
import { sortBlocks } from '../helpers/blocks-helpers.js';

const MainPage = () => {

	const form = useForm({ blocks: [] });

	const blocksFieldArray = useFieldArray({ name: 'blocks', control: form.control });

	useEffect(() => {
		let mounted = true;

		getMainPageBlocks().then(({ data }) => {
			mounted && form.reset({ blocks: sortBlocks(data).map(b => ({ value: b })) })
		})

		return () => mounted = false;
	}, [])

	return (
		<Box padding={2}>
			<BlocksComposition
				fieldArray={blocksFieldArray}
				// onDeleteBlock={onDeleteBlock}
				allowedBlocks={mainPageBlocks}
				isMainPage={true}
			/>
			<Box display='flex' justifyContent='end' alignItems='center' marginTop={4} >
			</Box>
		</Box>
	)
}

export default MainPage