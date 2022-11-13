import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const IsPublished = ({ isPublished, colored }) =>
isPublished
		? <VisibilityIcon style={{ fontSize: '20px', color: colored? 'var(--bs-success)' : 'var(--theme-color)' }} />
		: <VisibilityOffIcon style={{ fontSize: '20px', }} />

export default IsPublished