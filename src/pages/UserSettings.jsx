import React from 'react'
import { Box, Grid } from '@mui/material'
import SetNewPasswordForm from '../components/auth/SetNewPasswordForm'

const UserSettings = () => {
	return (
		<Box p={5}>
			<Grid container spacing={3} >
				<Grid item xs={6} sx={{marginX: 'auto'}}>
					<SetNewPasswordForm />
				</Grid>
			</Grid>
		</Box >
	)
}

export default UserSettings