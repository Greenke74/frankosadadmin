import React from 'react'
import { errorMessages } from '../../services/messages-service'
const ErrorMessage = ({ type, minLength, maxLength, min, max }) => (
		<span style={{
			fontSize: '12px',
			color: 'red'
		}}>
			{ (minLength || maxLength || min || max)
				? errorMessages[type](minLength || maxLength || min || max)
				: errorMessages[type]
			}
		</span>
	)

export default ErrorMessage