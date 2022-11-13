import React, { useRef, useState } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import SaveButton from './SaveButton.jsx';

import { getSrcFromFile, compressImage } from '../../helpers/file-helpers.js';

import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";

const ImageUploader = (props) => {
	const { ratio, onChange } = props;
	const cropperRef = useRef(null);
	const [fileUrl, setFileUrl] = useState('');
	const [file, setFile] = useState(null);

	const onSubmit = async () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		const crop = cropper.cropBoxData;

		const image = await compressImage(file, file.name, {
			...crop,
			container: cropper.getContainerData()
		});
		
		onChange(image)
		setFile(null)
	};

	return (
		<div>
			<label
				style={{
					color: 'var(--white)',
					backgroundColor: 'var(--active-color)',
					textTransform: 'none',
					padding: '8.5px 20px',
					borderRadius: '4px',
					cursor: 'pointer'
				}}
				htmlFor='fileUploader'
			>Завантажити зображення</label>
			<input
				{...props}
				type='file'
				id='fileUploader'
				multiple={false}
				onChange={event => {
					getSrcFromFile(event.target.files[0])
						.then(res => {
							setFileUrl(res)
						})
					setFile(event.target.files[0]);
				}}
			/>
			<Dialog open={!!file} onClose={() => setFile(null)} sx={{ padding: '9px' }} >
				<DialogContent>
					<Cropper
						src={fileUrl}
						style={{ height: '100%', maxHeight: '70vh', width: '100%' }}
						aspectRatio={ratio}
						guides={false}
						ref={cropperRef}
					/>
					<Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'end' }}>
						<SaveButton onClick={onSubmit} />
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default ImageUploader;