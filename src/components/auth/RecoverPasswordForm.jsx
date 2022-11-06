import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, FormControl, Typography } from '@mui/material'
import ErrorMessage from '../common/ErrorMessage'
import { StyledInputBase, StyledInputLabel, SuccessButton } from '../common/StyledComponents'
import { REGULAR_EXPRESSIONS } from '../../services/regex-service'
import { resetPassword } from '../../services/auth-api-service'
import Swal from 'sweetalert2';

const RecoverPasswordForm = () => {
	const navigate = useNavigate();
	const [disableSubmit, setDisableSubmit] = useState(false);
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { email: '' }, mode: 'onSubmit'
	})

	const onSubmit = ({ email }) => {
		setDisableSubmit(true);
		resetPassword(email).then(() => {
			Swal.fire({
				position: 'top-right',
				icon: 'success',
				title: 'Лист надіслано на пошту',
				color: 'var(--theme-color)',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			}).then(() => {
				navigate('/')
			})
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box
				width='350px'
				maxWidth='95vw'
				padding={4}
				borderRadius={'8px'}
				backgroundColor='var(--background-color)'
				display='flex'
				flexDirection='column'
			>
				<Typography
					component='h1'
					fontSize='20px'
					fontWeight={500}
					color='var(--theme-color)'
					textAlign='center'
					marginBottom='5px'
				>
					Відновлення паролю
				</Typography>
				<Typography
					component='p'
					fontSize='12px'
					fontWeight={400}
					color='var(--theme-color)'
					textAlign='center'
					marginBottom='25px'
				>
					Для створення нового паролю введіть електронну адресу свого облікового запису
				</Typography>
				<FormControl variant="standard" fullWidth>
					<StyledInputLabel shrink htmlFor="emailInput">E-mail</StyledInputLabel>
					<StyledInputBase id='emailInput' placeholder='E-mail' {...register('email', { required: true, pattern: REGULAR_EXPRESSIONS.EMAIL })} />
					{errors.email && <ErrorMessage type={errors?.email.type == 'pattern' ? 'emailPattern' : errors?.email.type} />}
				</FormControl>
				<Box justifyContent='end' display='flex' marginTop='20px' >
					<SuccessButton disabled={disableSubmit} style={{ width: 'fit-content' }} type='submit'>Відновити пароль</SuccessButton>
				</Box>
			</Box>
		</form>
	)
}

export default RecoverPasswordForm