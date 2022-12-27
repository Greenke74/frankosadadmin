import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Page from '../components/common/Page';
import PageHeader from '../components/common/PageHeader';
import { Alert, Box } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import IsPublished from '../components/common/IsPublished';
import AddButton from '../components/common/AddButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { deleteService, getServices } from '../services/services-api-service';
import { getImageSrc } from '../services/storage-service';
import { deleteConfirmAlert, deletedSuccessfullyAlert } from '../services/alerts-service';

const ITEMS_PER_PAGE = 8;
const ROW_HEIGHT = 82;

const ServicesList = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getServices().then(response => {
      mounted && setData(response);
    })
    return () => mounted = false;
  }, [])

  const handleDelete = (id) => {
		deleteConfirmAlert('послугу').then(async result => {
			if (result.value) {
				await deleteService(id);
				deletedSuccessfullyAlert('Послугу')
				const services = await getServices()
				setData(services);
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
      headerName: 'Послуга'
    },
    {
      field: 'is_published',
      sortable: false,
      width: 120,
      headerName: 'Опубліковано',
      renderCell: ({ row }) => (<div style={{ margin: 'auto' }}><IsPublished isPublished={row.is_published} colored /></div>)
    },
    {
      field: 'description',
      headerName: 'Опис',
      width: 440,
      renderCell: ({ row }) => (
        <div
          style={{
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            whiteSpace: 'break-spaces',
          }}
        >
          {row.description}
        </div>
      )
    },
    {
      headerName: 'Дії',
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon color='success' />}
          onClick={() => { navigate(`/services/${params.row.id}`) }}
          label="Print"
          title={'Редагувати послугу'}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color='error' />}
          label="Delete"
          title={'Видалити послугу'}
          onClick={() => { handleDelete(params.row.id) }}
        />
      ]
    }
  ]

  return (
    <>
      <PageHeader title={'Список послуг'} />
      <Page>
        <Box padding={2} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e0e0e0', borderRadius: 1, marginBottom: 2, padding: 1 }}>
            <AddButton
              label='Додати послугу'
              onClick={() => navigate('/services/new')}
            />
            <Alert sx={{ height: '36.5px', overflow: 'hidden', padding: '0 10px' }} severity='info'>
              Ви можете додати нові послуги
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

export default ServicesList