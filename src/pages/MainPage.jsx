import React, { useState, useEffect } from 'react'
import BlocksComposition from '../components/BlocksComposition/index.jsx';

import { blocks } from '../components/blocks/index.js';
import { getPageBlocks } from '../services/pages-api-service.js';

const MainPage = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		getPageBlocks('mainPage').then((data) => {
			setData(data)
		})
	}, [])
	return (
		<BlocksComposition data={data} allowedBlocks={blocks} relatedTo={'page'} />
	)
}

export default MainPage