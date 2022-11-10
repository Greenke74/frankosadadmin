import React, { useState, useEffect } from 'react'
import BlocksComposition from '../components/BlocksComposition/index.jsx';
import { getPageBlocks } from '../services/pages-api-service.js';

const MainPage = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		getPageBlocks('mainPage').then((data) => {
			setData(data)
		})
	}, [])
	return (
		<BlocksComposition data={data} />
	)
}

export default MainPage