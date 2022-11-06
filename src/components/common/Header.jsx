import React from 'react'
import { useLocation } from 'react-router-dom';
import { getRoutes } from '../../services/routes-service';
const Header = () => {
	const location = useLocation();
	return getRoutes().find(r => r.path === location.pathname)?.label &&
		<header style={{
			width: '100%',
			height: '60px',
			backgroundColor: 'var(--white)',
			// marginLeft: '-24px',
			fontWeight: '600',
			color: 'var(--theme-color)',
			display: 'flex',
			alignItems: 'center',
			boxShadow: '0px 2px 24px rgb(0 0 25 / 15%)'
		}}>
			<h1 className='m-0 mx-5' style={{
				fontSize: '30px',
			}}>
				{getRoutes().find(r => r.path === location.pathname)?.label ?? ''}
			</h1>
		</header>

}

export default Header