import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import IsPublished from '../components/common/IsPublished';

import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddIcon from '@mui/icons-material/Add';

import { getCompletedProjects } from '../services/portfolio-api-service';

import Swal from 'sweetalert2';
import '../styles/swal.scss';

const PortfolioPage = () => {
	const navigate = useNavigate();
	const deleteProject = (id) => {
		Swal.fire({
			title: 'Видалити',
			html: 'Ви впевнені, що хочете видалити проект?',
			showCancelButton: true,
			cancelButtonText: 'Скасувати',
			confirmButtonText: 'Видалити',
			focusCancel: true,
			customClass: 'deleteSwal'
		}).then(result => {
			if (result.value) {
				// delete project

			}
		})
	}
	const columns = [
		{
			field: 'id',
			hideable: true
		},
		{
			field: 'image',
			width: 500,
			sortable: false,
			renderCell: ({ row }) => (
				<div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
					<img style={{ objectFit: 'contain', maxWidth: '150px', maxHeight: '100%', borderRadius: 4, marginRight: 10 }} src={row.image} />
					<p style={{ whiteSpace: 'normal', margin: 0, fontWeight: 500 }}>{row.title}</p>
				</div>
			),
			headerName: 'Зданий проєкт'
		},
		{
			field: 'completed_at',
			width: 140,
			sortable: false,
			headerName: 'Дата здачі',
			type: 'date',
			renderCell: ({ row }) => (<span>{new Date(row.completed_at).toLocaleDateString('uk-UA')}</span>)
		},
		{
			field: 'is_published',
			sortable: false,
			// type: 'boolean',
			width: 120,
			headerName: 'Опубліковно',
			renderCell: ({ row }) => (<div style={{ margin: 'auto' }}><IsPublished isPublished={row.is_published} colored /></div>)
		},
		{
			field: 'location',
			width: '300',
			sortable: false,
			headerName: 'Локація'
		},
		{
			headerName: 'Дії',
			field: 'actions',
			type: 'actions',
			width: 100,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<EditRoundedIcon sx={{ color: 'var(--bs-green)' }} />}
					onClick={() => { navigate(`/portfolioform/${params.row.id}`) }}
					label="Print"
					title={'Редагувати об\'єкт'}
				/>,
				<GridActionsCellItem
					icon={<DeleteIcon sx={{ color: 'var(--bs-danger)' }} />}
					label="Delete"
					title={'Видалити об\'єкт'}
					onClick={() => { deleteProject(params.row.id) }}
				/>
			]
		}
	]
	const [data, setData] = useState([]);

	useEffect(() => {
		let mounted = true;
		getCompletedProjects().then(response => {
			mounted && setData(response);
		})
		return () => mounted = false;
	}, [])

	return (

		<Box padding={2} >
			<Button
				startIcon={<AddIcon />}
				variant='text'
				style={{ textTransform: 'none', color: 'var(--theme-color)', backgroundColor: '#f7f7f7' }}
				onClick={() => navigate('/portfolioform/new')}
				sx={{
					padding: '6px 15px !important',
					marginBottom: 2,
					'& > span': { marginRight: '8px !important' }
				}}
			>
				Додати об'єкт
			</Button>
			<Box height='calc(100vh - 200px)'>
				<DataGrid
					rows={data}
					columns={columns}
					disableColumnFilter
					disableColumnMenu
					rowHeight={80}
					pageSize={7}
					columnVisibilityModel={{
						id: false
					}}
					sortModel={[{ field: 'id', sort: 'desc' }]}
				>
				</DataGrid>
			</Box>
		</Box>
	)
}

export default PortfolioPage