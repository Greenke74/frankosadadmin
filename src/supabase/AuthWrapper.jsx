import React, { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useDispatch } from "react-redux";
import { authSlice } from "../redux/slices/authSlice";
import { setAuthLoading } from "../redux/slices/authLoading";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (!user) {
        dispatch(setAuthLoading(false));
        return;
      }

      if (user) {
        const newState = {
          id: user.id,
          aud: user.aud,
          role: user.role,
          email: user.email,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_sign_in_at: user.last_sign_in_at,
          loading: false,
        };
        dispatch(authSlice.actions.login(newState));
      } else {
        dispatch(authSlice.actions.logout());
      }
			dispatch(setAuthLoading(false));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
              last_sign_in_at: user.last_sign_in_at,
              loading: false,
            };
            dispatch(authSlice.actions.login(newState));
          } else {
            dispatch(authSlice.actions.logout());
          }
        }
      }
    );

    return () => {
      authListener.subscription;
    };
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;
