import React, { Suspense } from 'react'
import Header from '../common/Header'
import Sidebar from './Sidebar/Sidebar'
import { StyledLinearProgress } from '../common/StyledComponents'
import { Box, Grid } from '@mui/material'

const Layout = ({ children }) =>
	<Grid container columns={20} wrap='nowrap' >
		<Grid item xs={5} lg={4} xl={3} component='aside' style={{ height: 'auto' }} >
			<Sidebar />
		</Grid>
		<Grid item xs={15} lg={16} xl={17} >
			<Suspense fallback={<StyledLinearProgress />}>
				{children}
			</Suspense>
		</Grid>
	</Grid >

export default Layout