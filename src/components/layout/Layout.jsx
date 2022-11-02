import React, { useState, Suspense } from 'react'
import Header from '../common/Header'
import Sidebar from './Sidebar/Sidebar'
import { StyledLinearProgress } from '../common/StyledComponents'

const Layout = ({ children }) => {
	return (
		<div className='row'>
			<aside className='col-2' style={{ height: '100vh' }}>
				<Sidebar />
			</aside>
			<div className='col-10'>
				<Header />
				<Suspense fallback={<StyledLinearProgress />}>
					<div className='row'>
						<main className=' col-9 mt-5 h-100'>
							{children}
						</main>
					</div>
				</Suspense>
			</div>
		</div >
	)
}

export default Layout