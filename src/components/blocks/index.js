export const blocks = [
	{
		type: 'slider',
		element: () => import('./Slider.jsx')
	},
	{
		type: "counter",
		element: () => import('./Counter.jsx'),
	},
	{
		type: "stepByStep",
		element: () => import('./StepByStep.jsx')
	}
]

