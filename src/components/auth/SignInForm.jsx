import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, Typography } from '@mui/material'
import { StyledInputBase, StyledInputLabel, SuccessButton } from '../common/StyledComponents'
import { REGULAR_EXPRESSIONS } from '../../services/regex-service';
import {  login } from '../../services/auth-api-service';
import ErrorMessage from '../common/ErrorMessage';

const SignInForm = ({ setResetPassword }) => {

	const [loginError, setLoginError] = useState(null);

	const { register, reset, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { email: '', password: '' }, mode: 'onChange'
	})

	const onSubmit = (credentails) => {
		login(credentails).then(user => {
			setLoginError(null);
		}).catch(e => {
			setLoginError(e)
		})
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
				gap={'20px'}
			>
				<Typography
					component='h1'
					fontSize='20px'
					fontWeight={500}
					color='var(--theme-color)'
					textAlign='center'
				>
					Увійдіть для доступу
				</Typography>
				<FormControl variant="standard" fullWidth>
					<StyledInputLabel shrink htmlFor="emailInput">E-mail</StyledInputLabel>
					<StyledInputBase id='emailInput' placeholder='E-mail' {...register('email', { required: true, pattern: REGULAR_EXPRESSIONS.EMAIL })} />
					{errors.email && <ErrorMessage type={errors?.email.type == 'pattern' ? 'emailPattern' : errors?.email.type} />}
				</FormControl>
				<FormControl variant="standard" fullWidth>
					<StyledInputLabel shrink htmlFor="passwordInput">Пароль</StyledInputLabel>
					<StyledInputBase id='passwordInput' type='password' placeholder='Пароль' {...register('password', { required: true })} />
					{errors.password && <ErrorMessage type={errors?.password?.type} />}
				</FormControl>
				{loginError && <ErrorMessage type={loginError} />}
				<Box justifyContent='space-between' display='flex' >
					<Button
						onClick={() => setResetPassword(true)}
						variant='text'
						sx={{ fontSize: '13px', fontWeight: 400, color: 'var(--theme-color)', textTransform: 'none' }}
					>Забули пароль?</Button>
					<SuccessButton type='submit'>Увійти</SuccessButton>
				</Box>
			</Box>
		</form>
	)
}

export default SignInForm