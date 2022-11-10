import React, { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getWidthAndHeightFormUrl, getSrcFromFile, getCroppedImg } from '../../helpers/file-helpers.js';

const ImageUploader = (props) => {
	const { aspectRatio } = props;
	const [fileUrl, setFileUrl] = useState('');
	const [file, setFile] = useState(null);
	const [crop, setCrop] = useState({});

	useEffect(() => {
		getWidthAndHeightFormUrl(fileUrl)
			.then(({ width, height }) => {
				setCrop({
					x: (width - (width >= height * aspectRatio ? height * aspectRatio : width)) / 2,
					y: (height - (height >= width / aspectRatio ? width / aspectRatio : height)) / 2,
					width: width >= height * aspectRatio ? height * aspectRatio : width,
					height: height >= width / aspectRatio ? width / aspectRatio : height,
					unit: "px"
				})
			})
	}, [fileUrl]);

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
			<dialog open={!!file} style={{
				zIndex: '10',
				margin: 'auto',
				border: '1px solid var(--theme-color)',
				padding: '15px',
				borderRadius: '8px',
				backgroundColor: 'var(--white)',
				boxShadow: '0 0 200px 1.3rem #0000004a',
				top: '30px'

			}}>
				<ReactCrop aspect={props.aspectRatio} onComplete={(res) => {
					getCroppedImg(file, crop, 'cropped').then(result=>{
					})
				}
				} crop={crop} onChange={c => setCrop(c)} style={{
					maxWidth: '90vw',
					maxHeight: '90vh'
				}}>
					<img src={fileUrl} />
				</ReactCrop>
				<div>{Math.round(crop.width * 100) / 100} x {Math.round(crop.height * 100) / 100}</div>
			</dialog>
		</div>
	)
}

export default ImageUploader;