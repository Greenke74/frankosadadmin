import React, { useState, useEffect } from 'react'
import BlocksComposition from '../components/BlocksComposition/index.jsx';

import { blocks } from '../components/blocks/index.js';
import { getMainPageBlocks } from '../services/main-page-blocks-service.js';
import Swal from 'sweetalert2';

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
		<BlocksComposition
			blocks={data}
			allowedBlocks={blocks}
			isMainPage={true}
			onCompositionSubmit={() => Swal.fire({
				position: 'top-right',
				icon: 'success',
				title: 'Головну сторінку збережено',
				color: 'var(--theme-color)',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			})}
		/>
	)
}

export default MainPage