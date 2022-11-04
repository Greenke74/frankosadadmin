import React from 'react'
import { useSelector, useDispatch } from 'react-redux/es/exports';
import { authSlice } from '../../../redux/slices/authSlice';
import { getRoutes } from '../../../services/routes-service'
import { getSession, logout } from '../../../services/auth-api-service';
import Swal from 'sweetalert2';

import { Stack, Typography, Box, IconButton } from '@mui/material'
import SidebarButton from './SidebarButton'

import LogoutIcon from '@mui/icons-material/Logout';
import '../../../styles/swal.css';

const Sidebar = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: 'Вихід',
      html: 'Ви впевнені, що хочете вийти з обліковго запису?',
      showCancelButton: true,
      cancelButtonText: 'Скасувати',
      confirmButtonText: 'Вийти',
      focusCancel: true,
      customClass: 'logoutSwal'
    }).then(result => {
      if (result.value) {
        logout().then(() => {
          getSession().then(session => {
            dispatch(authSlice.actions.login(session?.user ?? null));
          })
        });
      }
    })
  }

  return (
    <Stack className='h-100' style={{
      backgroundColor: 'var(--theme-color)'
    }}>
      <Box padding='30px 20px' marginBottom='10px' display='flex' flexWrap='nowrap' alignItems='center' backgroundColor='var(--menu-button-color)' justifyContent='space-between'>
        <Box>
          <Typography
            component={'h4'}
            color='var(--white)'
            fontSize='12px'
            fontWeight={300}
          >
            {auth.email}
          </Typography>
          <Typography
            component={'h4'}
            color='var(--white)'
            fontSize='14px'
          >
            {auth.role ? '🥶 Адміністратор 🥶' : ''}
          </Typography>
        </Box>
        <IconButton onClick={handleLogout}  >
          <LogoutIcon
            style={{
              color: 'white',
            }}
          />
        </IconButton>
      </Box>
      {getRoutes().map(r => (
        <SidebarButton key={r.path} to={r.path} label={r.label} />
      ))}
    </Stack>
  )
}

export default Sidebar