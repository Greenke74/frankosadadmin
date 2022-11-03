import React, { useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient';

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const f = async () => {
      const session = await supabase.auth.getSession()
      console.log(session);
      setUser(session?.user ?? null)
      setLoading(false)
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )
      return () => {
        listener?.unsubscribe()
      }
    } 
    f();


  }, [])

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)