import React, { lazy, Suspense } from "react"
import { Spinner } from "../common/StyledComponents";

const blocks = [
	{
		type: 'slider',
		element: () => import('./Slider.jsx'),
		initialHeight: '200px'
	},
	{
		type: "counter",
		element: () => import('./Counter.jsx')
	},
]

export const SettingsBlock = ({ type, isPublished = true }) => {
	const block = blocks.find(b=>b.type===type)??null;
	if(!block){
		return null;
	}
	const Element = lazy(block.element);

	return <Suspense fallback={<Spinner style={{height: block.initialHeight??null}} />}><Element isPublished={isPublished} /></Suspense>
}


