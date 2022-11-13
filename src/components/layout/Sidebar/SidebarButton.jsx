import React from 'react'
import { Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarButton = ({ label, to }) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<Button
			style={{
				width: 'calc(100% - 20px)',
				margin: '10px 10px 0',
				textTransform: 'none',
				color: 'var(--white)',
				backgroundColor: location.pathname===to ? 'var(--menu-active-button-color)' : 'var(--menu-button-color)'
			}}
			onClick={() => navigate(to)}
		>
			{label}
		</Button>
	)
}

export default SidebarButton