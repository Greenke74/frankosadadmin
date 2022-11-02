import { lazy } from 'react';

const MainSettings = lazy(() => import('../pages/MainSettings.jsx'));

export const getRoutes = () => ([
	{
		path: '/',
		label: 'Головна сторінка'
	},
	{
		path: '/main-settings',
		label: 'Загальні налаштування',
		element: <MainSettings />,
	},
	{
		path: '/portfolio',
		label: 'Портфоліо',
		element: <></>,
	}
]) 