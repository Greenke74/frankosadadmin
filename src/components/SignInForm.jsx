import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux/es/exports';
import { Box, FormControl, Typography } from '@mui/material'
import { StyledInputBase, StyledInputLabel, SuccessButton } from './common/StyledComponents'
import { REGULAR_EXPRESSIONS } from '../services/regex-service';
import { getSession, login } from '../services/auth-api-service';
import { authSlice } from '../redux/slices/authSlice';
import ErrorMessage from './common/ErrorMessage';

const SignInForm = () => {
	const dispatch = useDispatch();
	const [loginError, setLoginError] = useState(null);
	useEffect(() => {
	  getSession().then(session => {
		dispatch(authSlice.actions.login(session?.user??null));
	  });
	
	}, [])
	
	const { register, reset, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { email: '', password: '' }, mode: 'onChange'
	})

	const onSubmit = (credentails) => {
		login(credentails).then(user => {
			const newState = {
				id: user.id,
				aud: user.aud,
				role: user.role,
				email: user.email,
				phone: user.phone,
				created_at: user.created_at,
				updated_at: user.updated_at,
				last_sign_in_at: user.last_sign_in_at
			}
			dispatch(authSlice.actions.login(newState));
			setLoginError(null);
		}).catch(e => {
			setLoginError(e)
		})
	}

	return (
		<Box display='flex' justifyContent='center' alignItems='center' height='100vh' backgroundColor='var(--theme-color)' >
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
					>
						Увійдіть для доступу
					</Typography>
					<FormControl variant="standard" fullWidth>
						<StyledInputLabel shrink htmlFor="emailInput">E-mail</StyledInputLabel>
						<StyledInputBase id='emailInput' placeholder='E-mail' {...register('email', { required: true, pattern: REGULAR_EXPRESSIONS.EMAIL })} />
						{errors.email && <ErrorMessage type={errors?.email.type=='pattern' ? 'emailPattern' : errors?.email.type} />}
					</FormControl>
					<FormControl variant="standard" fullWidth>
						<StyledInputLabel shrink htmlFor="passwordInput">Пароль</StyledInputLabel>
						<StyledInputBase id='passwordInput' type='password' placeholder='Пароль' {...register('password', { required: true })} />
						{errors.password && <ErrorMessage type={errors?.password?.type} />}
					</FormControl>
					{loginError && <ErrorMessage type={loginError} />}
					<Box marginLeft='auto' width='fit-content'>
						<SuccessButton type='submit'>Увійти</SuccessButton>
					</Box>
				</Box>
			</form>
		</Box>
	)
}

export default SignInForm