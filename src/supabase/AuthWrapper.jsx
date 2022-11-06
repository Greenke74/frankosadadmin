import React, { useEffect } from 'react'
import { supabase } from './supabaseClient';
import { useDispatch } from 'react-redux';
import { authSlice } from '../redux/slices/authSlice';

const AuthWrapper = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		supabase.auth.refreshSession().then(({ data: { session } }) => {
			const { user } = session;
			if (user) {
				const newState = {
					id: user.id,
					aud: user.aud,
					role: user.role,
					email: user.email,
					phone: user.phone,
					created_at: user.created_at,
					updated_at: user.updated_at,
					last_sign_in_at: user.last_sign_in_at
				}
				dispatch(authSlice.actions.login(newState))
			} else {
				dispatch(authSlice.actions.logout())
			}
		});

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_OUT") {
				dispatch(authSlice.actions.logout());
				return;
			}
			if (event === "SIGNED_IN") {
				const { user } = session;
				if (user) {
					const newState = {
						id: user.id,
						aud: user.aud,
						role: user.role,
						email: user.email,
						phone: user.phone,
						created_at: user.created_at,
						updated_at: user.updated_at,
						last_sign_in_at: user.last_sign_in_at
					}
					dispatch(authSlice.actions.login(newState))
				} else {
					dispatch(authSlice.actions.logout())
				}
			}
		});

		return () => {
			authListener.subscription;
		};
	}, []);
	return <>{children}</>
}

export default AuthWrapper