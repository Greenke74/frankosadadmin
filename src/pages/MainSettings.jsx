import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { REGULAR_EXPRESSIONS } from '../services/regex-service.js';

import { Grid, FormControl, Card, CardActions, Button, IconButton } from '@mui/material';
import { StyledInputBase, StyledInputLabel } from '../components/common/StyledComponents.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';
import SaveButton from '../components/common/SaveButton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

import Swal from 'sweetalert2';
import { getMainSettings, updateMainSettings } from '../services/setting-api-service.js';
import { Box } from '@mui/system';
import { CameraAlt, Delete } from '@mui/icons-material';
import { dataURLtoFile, getSrcFromFile } from '../helpers/file-helpers.js';
import { supabase } from '../supabase/supabaseClient.js';

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
	const [fieldIds, setFieldIds] = useState([]);
	const {
		reset,
		formState: { errors, isValid },
		handleSubmit,
		getValues,
		setValue,
		register,
		watch
	} = useForm({ defaultValues, mode: 'onChange' })
	const geoLocationUrl = watch('geoLocation.url');
	const favicon = watch('favicon');

	useEffect(() => {
		if (!geoLocationUrl) {
			setValue('geoLocation.address', undefined);
		}
	}, [geoLocationUrl])

	useEffect(() => {
		let mounted = true;
		const f = async () => {
			const { data, fields } = await getMainSettings();
			setFieldIds(fields);
			setDefaultFormValue(data);
			mounted && reset({ ...getValues(), ...data });
		}

		f();
		return () => mounted = false;
	}, [])

	const onSubmit = async (data) => {
		const { faviconFile } = data;
		delete data.faviconFile;
		const payload = Object.entries(data).map(([key, value]) => {
			if (JSON.stringify(defaultFormValue[key]) !== JSON.stringify(value)) {
				return {
					id: fieldIds.find(field => field.name === key)?.id,
					name: key,
					value: value
				}
			}
		}).filter(r => !!r)

		if (faviconFile) {
			const { data: { path } } =
				await supabase.storage
					.from('main-settings-bucket')
					.upload(`${Date.now()}-${faviconFile.name}`, faviconFile)

			payload.push({
				id: fieldIds.find(field => field.name === 'favicon')?.id,
				name: 'favicon',
				value: supabase.storage.from('main-settings-bucket').getPublicUrl(path).data.publicUrl
			});
		}

		if (payload.length === 0) return;

		updateMainSettings(payload)
			.then(() => {
				Swal.fire({
					position: 'top-right',
					icon: 'success',
					title: 'Дані успішно оновлено',
					color: 'var(--theme-color)',
					timer: 3000,
					showConfirmButton: false,
					toast: true,
				})
				setDefaultFormValue(data);
				reset(data);
			});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='pb-2'>
			<Grid container direction='column' padding={2} style={{ gap: 16 }} >
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12} md={6} >
						<FormControl variant="standard" required fullWidth>
							<StyledInputLabel shrink htmlFor="siteNameInput">
								Назва сайту
							</StyledInputLabel>
							<StyledInputBase error={!!(errors?.siteName)} placeholder='Назва сайту' id='siteNameInput' {...register('siteName', { required: true, maxLength: 20 })} />
						</FormControl>
						{errors.siteName && <ErrorMessage type={errors?.siteName?.type} maxLength={errors?.siteName?.type === 'maxLength' ? 20 : undefined} />}
					</Grid>
					<Grid item xs={12} md={6}>
						<Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
							<StyledInputLabel shrink htmlFor='mainImageUploader' sx={{ alignSelf: 'start' }}>
								Головне зображення
							</StyledInputLabel>
							<Card sx={{ width: 'fit-content', position: 'relative', overflow: 'visible' }}>
								{favicon
									? (<>
										<IconButton onClick={() => setValue('favicon', null)} sx={{ position: 'absolute', top: -20, right: -20, bgcolor: 'white' }}>
											<Delete sx={{ color: 'red' }} />
										</IconButton>
										<img src={favicon} style={{ width: '100px' }} />
									</>)
									: (<div style={{ width: 100, height: 100, backgroundColor: '#f7eeee', display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CameraAlt sx={{ fontSize: 36, color: '#dedede' }} /></div>)}
							</Card>
							<ImageUploader id='mainImageUploader' ratio={1 / 1} onChange={async (file) => {
								setValue('faviconFile', file);
							}} />
						</Box>
					</Grid>
				</Grid>
				<Grid item container direction='row' flexWrap='nowrap' spacing={2} >
					<Grid item xs={6}>
						<FormControl variant="standard" error={!!(errors?.contactPhone)} fullWidth={true} >
							<StyledInputLabel shrink htmlFor="contactPhoneInput">
								Номер телефону
							</StyledInputLabel>
							<StyledInputBase error={!!(errors?.contactPhone)} placeholder="380123456789" id='contactPhoneInput' {...register('contactPhone', { pattern: REGULAR_EXPRESSIONS.PHONE })} />
						</FormControl>
						{errors.contactPhone && <ErrorMessage type={errors?.contactPhone ? 'phonePattern' : undefined} />}
					</Grid>
					<Grid item xs={6}>
						<FormControl variant="standard" error={!!(errors?.contactMail)} fullWidth>
							<StyledInputLabel shrink htmlFor="contactMailInput">
								Електронна пошта
							</StyledInputLabel>
							<StyledInputBase error={!!(errors?.contactMail)} placeholder="example@mail.com" id='contactMailInput' {...register('contactMail', { pattern: REGULAR_EXPRESSIONS.EMAIL })} />
						</FormControl>
						{errors.contactMail && <ErrorMessage type={errors?.contactMail ? 'emailPattern' : undefined} />}
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
			<div className='d-flex justify-content-end px-3 pb-2'>
				<SaveButton disabled={!isValid} type='submit' />
			</div>
		</form>
	)
}

export default MainSettings