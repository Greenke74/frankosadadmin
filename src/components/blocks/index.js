export const blocks = [
	{
		label: 'Слайдер',
		type: 'slider',
		element: () => import('./Slider.jsx')
	},
	{
		label: 'Лічильники',
		type: "counter",
		element: () => import('./Counter.jsx'),
	},
	{
		label: 'Покрокова інформація',
		type: "stepByStep",
		element: () => import('./StepByStep.jsx')
	}
]

