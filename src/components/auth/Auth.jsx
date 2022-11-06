import React, { useState, lazy, Suspense } from 'react'
import { Box } from '@mui/system'
import { Spinner } from '../common/StyledComponents';
const RecoverPasswordForm = lazy(() => import('./RecoverPasswordForm'));
import SignInForm from './SignInForm';

const Auth = () => {
	const [resetPassword, setResetPassword] = useState(false);
	return (
		<Box display='flex' justifyContent='center' alignItems='center' height='100vh' backgroundColor='var(--theme-color)' >
			{resetPassword
				? (
					<Suspense fallback={<Spinner />}>
						<RecoverPasswordForm />
					</Suspense>
				)
				: (
					<SignInForm setResetPassword={setResetPassword} />
				)}

		</Box>
	)
}

export default Auth