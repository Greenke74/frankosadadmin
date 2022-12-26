import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import IsPublished from '../components/common/IsPublished';
import AddButton from '../components/common/AddButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { deleteProject, getProjects } from '../services/portfolio-api-service';

import Swal from 'sweetalert2';
import '../styles/swal.scss';
import { getImageSrc } from '../services/storage-service';
import Page from '../components/common/Page';
import PageHeader from '../components/common/PageHeader';

const ITEMS_PER_PAGE = 8;
const ROW_HEIGHT = 82;

const ProjectsList = () => {
	const navigate = useNavigate();
	const handleDelete = (id) => {
		Swal.fire({
			title: 'Видалити',
			html: 'Ви впевнені, що хочете видалити проект?',
			showCancelButton: true,
			cancelButtonText: 'Скасувати',
			confirmButtonText: 'Видалити',
			focusCancel: true,
			customClass: 'deleteSwal'
		}).then(async result => {
			if (result.value) {
				await deleteProject(id);
				Swal.fire({
					position: 'top-right',
					icon: 'success',
					title: 'Проєкт успішно видалено',
					color: 'var(--theme-color)',
					timer: 3000,
					showConfirmButton: false,
					toast: true,
				})
				const projects = await getProjects()
				setData(projects);
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
					<img style={{ objectFit: 'contain', maxWidth: '150px', maxHeight: '100%', borderRadius: 4, marginRight: 10 }} src={getImageSrc(row.image)} />
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
			width: 120,
			headerName: 'Опубліковано',
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
					icon={<EditRoundedIcon color='success' />}
					onClick={() => { navigate(`/projects/${params.row.id}`) }}
					label="Print"
					title={'Редагувати об\'єкт'}
				/>,
				<GridActionsCellItem
					icon={<DeleteIcon color='error' />}
					label="Delete"
					title={'Видалити об\'єкт'}
					onClick={() => { handleDelete(params.row.id) }}
				/>
			]
		}
	]
	const [data, setData] = useState([]);

	useEffect(() => {
		let mounted = true;
		getProjects().then(response => {
			mounted && setData(response);
		})
		return () => mounted = false;
	}, [])

	return (
		<>
			<PageHeader
				title={'Список проєктів'}
			/>
			<Page>
				<Box padding={2} >
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e0e0e0', borderRadius: 1, marginBottom: 2, padding: 1 }}>
						<AddButton
							label='Додати проєкт'
							onClick={() => navigate('/projects/new')}
						/>
						<Alert sx={{ height: '36.5px', overflow: 'hidden', padding: '0 10px' }} severity='info'>
							Ви можете додати нові проєкти
						</Alert>
					</Box>
					<Box height={`calc((${ITEMS_PER_PAGE} * ${ROW_HEIGHT}px) + 111px)`}>
						<DataGrid
							rows={data}
							columns={columns}
							disableColumnFilter
							disableColumnMenu
							rowHeight={ROW_HEIGHT}
							pageSize={ITEMS_PER_PAGE}
							disableSelectionOnClick={true}
							columnVisibilityModel={{
								id: false
							}}
							sortModel={[{ field: 'id', sort: 'desc' }]}
							sx={{
								'div:last-child > div': {
									borderBottom: 'none !important'
								}
							}}
						>
						</DataGrid>
					</Box>
				</Box >
			</Page>
		</>
	)
}

export default ProjectsList