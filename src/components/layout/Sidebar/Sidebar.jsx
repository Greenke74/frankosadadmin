import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux/es/exports';
import { authSlice } from '../../../redux/slices/authSlice';
import { getRoutes } from '../../../services/routes-service'
import { getSession, logout } from '../../../services/auth-api-service';
import Swal from 'sweetalert2';

import { Stack, Typography, Box, IconButton, Tooltip } from '@mui/material'
import SidebarButton from './SidebarButton'

import LogoutIcon from '@mui/icons-material/Logout';
import '../../../styles/swal.scss';

const Sidebar = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

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
            dispatch(authSlice.actions.logout());
          })
            .catch(e => {
              dispatch(authSlice.actions.logout(null));
            })
        });
      }
    })
  }

  return (
    <Stack style={{
      backgroundColor: 'var(--theme-color)',
      minHeight: '100vh',
      height: '100%',
      width: 'auto',
      position: 'sticky',
      top: 0,
      borderRight: '1px solid var(--menu-active-button-color)'
    }}>
      <Box
        padding='30px 20px'
        marginBottom='10px'
        display='flex'
        flexWrap='nowrap'
        alignItems='center'
        backgroundColor='var(--menu-button-color)'
        justifyContent='space-between'
        borderBottom='1px solid var(--menu-active-button-color)'
      >
        <Link to='/account-settings' style={{
          textDecoration: 'none'
        }}>
          <Typography
            component={'h4'}
            color='var(--white)'
            fontSize='12px'
            fontWeight={300}
            textDecoration='none'
            sx={{
            }}
          >
            {auth.email}
          </Typography>
          <Typography
            component={'h5'}
            color='var(--white)'
            fontSize='14px'
          >
            {auth.role ? '🥶 Адміністратор 🥶' : ''}
          </Typography>
        </Link>
        <Tooltip title="Вийти" >
          <IconButton onClick={handleLogout}  >
            <LogoutIcon
              style={{
                color: 'white',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      {getRoutes().map(r => {
        return r.label && !r.hideAsideButton && <SidebarButton key={r.path} to={r.path} label={r.label} />
      })}
    </Stack>
  )
}

export default Sidebar