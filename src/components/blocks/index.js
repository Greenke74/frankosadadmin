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

export const projectBlocks = [
	{
		label: 'Лічильники',
		type: "counter",
		element: () => import('./Counter.jsx'),
	},
	{
		label: 'Покрокова інформація',
		type: "stepByStep",
		element: () => import('./StepByStep.jsx')
	},
	{
		label: 'Зображення з підписом',
		type: "pictureDescription",
		element: () => import('./PictureDescription.jsx')
	},
	{
		label: 'Зображення та текст',
		type: "pictureParagraph",
		element: () => import('./PictureParagraph.jsx')
	},
	{
		label: 'Звичайний текст',
		type: "simpleText",
		element: () => import('./SimpleText.jsx')
	}
]

