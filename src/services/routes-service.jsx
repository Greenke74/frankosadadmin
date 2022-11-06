export const getRoutes = () => ([
	{
		path: '/',
		label: 'Головна сторінка',
		element: () => import('../pages/MainPage.jsx')
	},
	{
		path: '/main-settings',
		label: 'Загальні налаштування',
		element: () => import('../pages/MainSettings.jsx')
	},
	{
		path: '/portfolio',
		label: 'Портфоліо',
		element: <></>,
	},
	{
		path: '/account-settings',
		label: 'Налаштування профілю',
		element: () => import('../pages/UserSettings.jsx'),
		hideAsideButton: true
	}
])