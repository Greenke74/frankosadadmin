import React, { useState, useEffect, Suspense } from 'react'
import Header from '../common/Header'
import Sidebar from './Sidebar/Sidebar'
import { StyledLinearProgress } from '../common/StyledComponents'
import { Box } from '@mui/material'

const Layout = ({ children }) => {

	return (
		<Box display='flex' flexWrap='nowrap' >
			<Box component='aside' className='col-auto' minWidth='250px' height='100vh' >
				<Sidebar />
			</Box>
			<Box width='100%'>
				<Header />
				<Suspense fallback={<StyledLinearProgress />}>
						<Box component='main' margin={3} flexGrow='1' >
							{children}
						</Box>
				</Suspense>
			</Box>
		</Box >
	)
}

export default Layout