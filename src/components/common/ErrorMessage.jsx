import React from 'react'
import { errorMessages } from '../../services/messages-service'
const ErrorMessage = ({ type, minLength = null, maxLength = null, min = null, max = null }) => (
	<span style={{
		fontSize: '12px',
		color: 'red'
	}}>
		{(minLength !== null || maxLength !== null || min !== null || max !== null)
			? errorMessages[type](minLength || maxLength || min || max)
			: errorMessages[type]
		}
	</span>
)
export default ErrorMessage