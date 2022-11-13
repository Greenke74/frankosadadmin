import React from 'react'
import { getRoutes } from '../../services/routes-service';
import { useLocation } from 'react-router-dom';

const Header = () => {
	const { pathname } = useLocation();

	const label = getRoutes().find(r => r.path === pathname)?.label;
	return label &&
		<header style={{
			width: '100%',
			height: '60px',
			backgroundColor: 'var(--white)',
			fontWeight: '600',
			color: 'var(--theme-color)',
			display: 'flex',
			alignItems: 'center',
			boxShadow: '0px 2px 24px rgb(0 0 25 / 15%)'
		}}>
			<h1 className='m-0 mx-5' style={{
				fontSize: '30px',
			}}>
				{label ?? ''}
			</h1>
		</header>
}

export default Header