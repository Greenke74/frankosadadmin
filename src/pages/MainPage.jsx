import React, { useState, useEffect } from 'react'
import BlocksComposition from '../components/BlocksComposition/index.jsx';

import { blocks } from '../components/blocks/index.js';
import { getMainPageBlocks } from '../services/blocks-api-service.js';

const MainPage = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		let mounted = true;

		getMainPageBlocks().then(({ data }) => {
			mounted && setData(data)
		})

		return () => mounted = false;
	}, [])
	return (
		<BlocksComposition blocks={data} allowedBlocks={blocks} relatedTo={'page'} />
	)
}

export default MainPage