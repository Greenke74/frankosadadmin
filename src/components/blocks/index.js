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
		label: 'Редактор контенту',
		type: 'htmlContent',
		element: () => import('./HtmlContent.jsx')
	},
	{
		label: 'Наші роботи',
		type: 'ourWorks',
		element: () => import('./OurWorks.jsx')
	},
	{
		label: 'Відгуки клієнтів',
		type: 'reviews',
		element: () => import('./Reviews.jsx')
	}
]

export const mainPageBlocks = [
	'counter', 'stepByStep', 'servicesSlider', 'projectsSlider', 'ourWorks', 'reviews'
]

export const projectBlocks = [
	'counter', 'stepByStep', 'pictureDescription', 'pictureParagraph', 'htmlContent'
]

export const serviceBlocks = [
	'counter', 'stepByStep', 'pictureDescription', 'pictureParagraph', 'htmlContent'
]

