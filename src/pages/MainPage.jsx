import React, { useState } from 'react'
import BlocksComposition from '../components/BlocksComposition/index.jsx';

const MainPage = () => {
	const [blocks, setBlocks] = useState([
		{type: "slider", is_published: true}, 
		{type: "counter", is_published: false}
	]);
	return (
		<BlocksComposition blocks={blocks} setBlocks={setBlocks} />
	)
}

export default MainPage