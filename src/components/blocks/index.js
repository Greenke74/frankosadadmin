export const blocks = [
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
		label: 'Карусель послуг',
		type: 'servicesSlider',
		element: () => import('./ServicesSlider.jsx')
	},
	{
		label: 'Карусель проєктів',
		type: 'projectsSlider',
		element: () => import('./ProjectsSlider.jsx')
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
	},
	{
		label: 'Редактор контенту',
		type: 'htmlContent',
		element: () => import('./HtmlContent.jsx')
	}
]

