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
		path: '/projects',
		label: 'Портфоліо',
		element: () => import('../pages/ProjectsList.jsx'),
	},
	{
		path: '/projects/:id',
		label: 'Проєкт',
		element: () => import('../pages/ProjectForm.jsx'),
		hideAsideButton: true

	},
	{
		path: '/services',
		label: 'Послуги',
		element: () => import('../pages/ServicesPage.jsx'),
	},
	{
		path: '/account-settings',
		label: 'Налаштування профілю',
		element: () => import('../pages/UserSettings.jsx'),
		hideAsideButton: true
	}
])