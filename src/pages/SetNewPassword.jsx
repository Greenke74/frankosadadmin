import { Box } from '@mui/system'
import React from 'react'
import SetNewPasswordForm from '../components/auth/SetNewPasswordForm.jsx';

const SetNewPassword = () => {
	return (
		<Box display='flex' justifyContent='center' alignItems='center' height='100vh' backgroundColor='var(--theme-color)' >
			<SetNewPasswordForm />
		</Box>
	)
}

export default SetNewPassword