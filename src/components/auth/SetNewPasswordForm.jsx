import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, FormControl, Typography } from '@mui/material'
import { StyledInputBase, StyledInputLabel, SuccessButton } from '../common/StyledComponents'
import { setNewPassword } from '../../services/auth-api-service'
import Swal from 'sweetalert2';
import ErrorMessage from '../common/ErrorMessage';
import SaveButton from '../common/SaveButton';

const SetNewPasswordForm = () => {
	const navigate = useNavigate();
	const [disableSubmit, setDisableSubmit] = useState(false);
	const { watch, register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { password: '', passwordCopy: '' }, mode: 'onChange'
	})
	const [passwordsEqual, setPasswordsEqual] = useState(true);

	const password = watch('password');
	const passwordCopy = watch('passwordCopy');

	useEffect(() => {
		if(!passwordsEqual && password === passwordCopy){
			setPasswordsEqual(true);
		}

	}, [password, passwordCopy])

	const onSubmit = ({ password, passwordCopy }) => {
		if (password !== passwordCopy) {
			setPasswordsEqual(false);
			Swal.fire({
				position: 'top-right',
				icon: 'error',
				title: 'Паролі не співпадають',
				color: 'var(--theme-color)',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			})
			return;
		}
		setPasswordsEqual(true);
		setDisableSubmit(true);
		setNewPassword(password).then(() => {
			Swal.fire({
				position: 'top-right',
				icon: 'success',
				title: 'Пароль успішно оновлено',
				color: 'var(--theme-color)',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			}).then(() => {
				navigate('/');
			})
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography
				component='h1'
				fontSize='20px'
				fontWeight={500}
				color='var(--theme-color)'
				textAlign='center'
				marginBottom='5px'
			>
				Встановлення нового паролю
			</Typography>
			<Typography
				component='p'
				fontSize='12px'
				fontWeight={400}
				color='var(--theme-color)'
				textAlign='center'
				marginBottom='25px'
			>
				Введіть новий пароль
			</Typography>
			<FormControl variant="standard" fullWidth sx={{ marginBottom: 2 }}>
				<StyledInputLabel shrink htmlFor="passwordInput">Пароль</StyledInputLabel>
				<StyledInputBase placeholder='Ваш новий пароль' id='passwordInput' type="password" {...register('password', { minLength: 6, required: true })} />
				{errors.password && <ErrorMessage type={errors?.password?.type} minLength={errors?.password?.type === 'minLength' ? 6 : undefined} />}
			</FormControl>
			<FormControl variant="standard" fullWidth>
				<StyledInputLabel shrink htmlFor="passwordCopyInput">Пароль ще раз</StyledInputLabel>
				<StyledInputBase placeholder='Ваш новий пароль' id='passwordCopyInput' type="password" {...register('passwordCopy', { minLength: 6, required: true })} />
				{errors.passwordCopy && <ErrorMessage type={errors?.passwordCopy?.type} minLength={errors?.passwordCopy?.type === 'minLength' ? 6 : undefined} />}
			</FormControl>
			{!passwordsEqual && <ErrorMessage type='passwordsNotEqual' />}
			<Box justifyContent='end' display='flex' marginTop='20px' >
				<SaveButton disabled={disableSubmit} style={{ width: 'fit-content' }} type='submit' />
			</Box>
		</form >
	)
}

export default SetNewPasswordForm