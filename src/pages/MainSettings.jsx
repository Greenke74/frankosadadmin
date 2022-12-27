import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { REGULAR_EXPRESSIONS } from '../services/regex-service.js';

import { Grid, FormControl, Card, IconButton } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';
import SaveButton from '../components/common/SaveButton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

import Swal from 'sweetalert2';
import { getMainSettings, updateMainSettings } from '../services/setting-api-service.js';
import { Box } from '@mui/system';
import { CameraAlt, Delete } from '@mui/icons-material';
import { getSrcFromFile } from '../helpers/file-helpers.js';
import { deleteImage, getImageSrc, uploadImage } from '../services/storage-service.js';
import { changesSavedAlert, checkErrorsAlert } from '../services/alerts-service.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Page from '../components/common/Page.jsx';

const defaultValues = {
	siteName: '',
	contactMail: '',
	contactPhone: '',
	geoLocation: {
		url: '',
		address: ''
	},
	mediaLinks: {
		instagramUrl: '',
		facebookUrl: '',
	},
	favicon: '',
	faviconFile: null
}


const MainSettings = () => {
	const [defaultFormValue, setDefaultFormValue] = useState(defaultValues);
	const [imageToDelete, setImageToDelete] = useState(null);
	const [fieldIds, setFieldIds] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		reset,
		formState: { errors },
		handleSubmit,
		getValues,
		setValue,
		register,
		watch
	} = useForm({ defaultValues, mode: 'onChange' })
	const geoLocationUrl = watch('geoLocation.url');
	const favicon = watch('favicon');

	const fetchData = async () => {
		const { data, fields } = await getMainSettings();
		setFieldIds(fields);
		setDefaultFormValue(data);
		reset({ ...getValues(), ...data, favicon: getImageSrc(data.favicon) });
	}

	useEffect(() => {
		if (!geoLocationUrl) {

			setValue('geoLocation.address', undefined);
		}
	}, [geoLocationUrl])

	useEffect(() => {
		let mounted = true;

		mounted && fetchData();

		return () => mounted = false;
	}, [])

	const onSubmit = async (data) => {
		setIsSubmitting(true);
		const { faviconFile } = data;
		let faviconKey = null;
		delete data.faviconFile;
		const payloadData = { ...data }

		if (faviconFile) {
			await deleteImage(imageToDelete);

			faviconKey = await uploadImage(faviconFile)
			setValue('favicon', getImageSrc(faviconKey));
			setValue('faviconFile', null);

			payloadData.favicon = faviconKey
		} else {
			delete payloadData.favicon;
		}

		const payload = Object.entries(payloadData).map(([key, value]) => {
			if (JSON.stringify(defaultFormValue[key]) !== JSON.stringify(value)) {
				return {
					id: fieldIds.find(field => field.name === key)?.id,
					name: key,
					value: value
				}
			}
		}).filter(r => !!r)

		if (payload.length === 0) {
			setIsSubmitting(false);
			changesSavedAlert();
			return;
		}

		updateMainSettings(payload)
			.then(async () => {
				await fetchData();
				changesSavedAlert()
			})
			.finally(() => setIsSubmitting(false));
	}

	return (
		<>
			<PageHeader
				title='Головна сторінка'
				onSubmit={handleSubmit(onSubmit, checkErrorsAlert)}
				submitDisabled={isSubmitting}
			/>
			<Page>
				<Grid container direction='column' padding={2} style={{ gap: 16 }} >
					<Grid item container xs={12} spacing={2} marginBottom={2}>
						<Grid item xs={12} md={6} >
							<Grid container spacing={2} direction='column'>
								<Grid item xs={12}>
									<FormControl variant="standard" required fullWidth>
										<StyledInputLabel shrink htmlFor="siteNameInput">
											Назва сайту
										</StyledInputLabel>
										<StyledInputBase error={!!(errors?.siteName)} placeholder='Назва сайту' id='siteNameInput' {...register('siteName', { required: true, maxLength: 20 })} />
									</FormControl>
									{errors.siteName && <ErrorMessage type={errors?.siteName?.type} maxLength={errors?.siteName?.type === 'maxLength' ? 20 : undefined} />}
								</Grid>
								<Grid item xs={12}>
									<FormControl variant="standard" error={!!(errors?.contactPhone)} fullWidth={true} >
										<StyledInputLabel shrink htmlFor="contactPhoneInput">
											Номер телефону
										</StyledInputLabel>
										<StyledInputBase error={!!(errors?.contactPhone)} placeholder="380123456789" id='contactPhoneInput' {...register('contactPhone', { pattern: REGULAR_EXPRESSIONS.PHONE })} />
									</FormControl>
									{errors.contactPhone && <ErrorMessage type={errors?.contactPhone ? 'phonePattern' : undefined} />}
								</Grid>
								<Grid item xs={12}>
									<FormControl variant="standard" error={!!(errors?.contactMail)} fullWidth>
										<StyledInputLabel shrink htmlFor="contactMailInput">
											Електронна пошта
										</StyledInputLabel>
										<StyledInputBase error={!!(errors?.contactMail)} placeholder="example@mail.com" id='contactMailInput' {...register('contactMail', { pattern: REGULAR_EXPRESSIONS.EMAIL })} />
									</FormControl>
									{errors.contactMail && <ErrorMessage type={errors?.contactMail ? 'emailPattern' : undefined} />}
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
								<StyledInputLabel shrink htmlFor='mainImageUploader' sx={{ alignSelf: 'start' }}>
									Головне зображення
								</StyledInputLabel>
								<Card sx={{ width: 'fit-content', position: 'relative', overflow: 'visible', borderRadius: '5px' }}>
									{favicon
										? (<>
											<IconButton size='small' onClick={() => {
												// setImageToDelete(favicon);
												setValue('favicon', null)
											}
											} sx={{ position: 'absolute', top: -17, right: -17, bgcolor: 'white', "&:hover": { bgcolor: '#dedede' } }}>
												<Delete sx={{ color: 'red' }} />
											</IconButton>
											<img src={favicon} style={{ width: '150px', borderRadius: '5px' }} />
										</>)
										: (<div style={{ width: 150, height: 150, backgroundColor: '#f7eeee', display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></div>)}
								</Card>
								<ImageUploader
									id='mainImageUploader' ratio={1 / 1}
									onChange={async (file) => {
										if (file) {
											setImageToDelete(favicon);
											setValue('faviconFile', file);
											setValue('favicon', await getSrcFromFile(file))
										}
									}} />
							</Box>
						</Grid>
					</Grid>
					<Grid item>
						<FormControl variant="standard" error={!!(errors?.geoLocation?.url)} fullWidth>
							<StyledInputLabel shrink htmlFor="geoLocationUrlInput">
								Посилання на геолокацію
							</StyledInputLabel>
							<StyledInputBase
								error={!!(errors?.geoLocation?.url)}
								placeholder="https://goo.gl/maps/example"
								id='geoLocationUrlInput'
								{...register('geoLocation.url', { required: false, pattern: REGULAR_EXPRESSIONS.LINK })}
							/>
						</FormControl>
						{errors?.geoLocation?.url && <ErrorMessage type={errors?.geoLocation?.url ? 'urlPattern' : undefined} />}
					</Grid>
					<Grid item>
						<FormControl variant="standard" error={!!(errors?.geoLocation?.address)} required={!!(geoLocationUrl)} fullWidth>
							<StyledInputLabel shrink htmlFor="geoLocationAddressInput">
								Заголовок геолокації
							</StyledInputLabel>
							<StyledInputBase
								error={!!(errors?.geoLocation?.address)}
								placeholder="м. Івано-Франківськ"
								id='geoLocationAddressInput'
								{...register('geoLocation.address', { required: !!(geoLocationUrl) })}
							/>
						</FormControl>
						{errors?.geoLocation?.address && <ErrorMessage type={errors?.geoLocation?.address.type} />}
					</Grid>
					<Grid item>
						<FormControl variant="standard" error={!!(errors?.mediaLinks?.instagramUrl)} fullWidth>
							<StyledInputLabel shrink htmlFor="instagramUrlInput">
								Посилання на Instagram
							</StyledInputLabel>
							<StyledInputBase
								error={!!(errors?.mediaLinks?.instagramUrl)}
								placeholder="https://www.instagram.com/example"
								id='instagramUrlInput'
								{...register('mediaLinks.instagramUrl', { required: false, pattern: REGULAR_EXPRESSIONS.LINK })}
							/>
						</FormControl>
						{errors?.mediaLinks?.instagramUrl && <ErrorMessage type={errors?.mediaLinks?.instagramUrl ? 'urlPattern' : undefined} />}
					</Grid>
					<Grid item>
						<FormControl variant="standard" error={!!(errors?.mediaLinks?.facebookUrl)} fullWidth>
							<StyledInputLabel shrink htmlFor="facebookUrlInput">
								Посилання на Facebook
							</StyledInputLabel>
							<StyledInputBase
								error={!!(errors?.mediaLinks?.facebookUrl)}
								placeholder="https://www.facebook.com/example"
								id='facebookUrlInput'
								{...register('mediaLinks.facebookUrl', { required: false, pattern: REGULAR_EXPRESSIONS.LINK })}
							/>
						</FormControl>
						{errors?.mediaLinks?.facebookUrl && <ErrorMessage type={errors?.mediaLinks?.facebookUrl ? 'urlPattern' : undefined} />}
					</Grid>
				</Grid>
			</Page>
		</>
	)
}

export default MainSettings