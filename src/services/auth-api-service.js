import { supabase } from "../supabase/supabaseClient.js";

export const getSession = () => new Promise((resolve, reject) => {
    try {
        supabase.auth.refreshSession()
            .then(response => {
                if(response.error){
                    reject(response.error.message);
                }
                resolve(response.data.session)
            })
            .catch(error => reject(error))
    } catch (e) {
        throw e
    }
});

export const register = (data) => new Promise((resolve, reject) => {
    const { email, password, user_name } = data
    try {
        supabase.auth.signUp(
            {
                email,
                password,
                user_name
            }
        )
            .then(response => {
                if(response.error){
                    reject(response.error.message)
                }
                resolve(response.data.user)
            })
            .catch(error => reject(error))
    } catch (e) {
        throw e
    }
})

export const login = (credentails) => new Promise((resolve, reject) => {
    try {
        supabase.auth.signInWithPassword(credentails)
            .then(response => {
                if(response.error){
                    reject(response.error.message);
                }
                resolve(response.data.user)
            })
            .catch(error => reject(error))
    } catch (e) {
        throw e
    }
})

export const logout = () => new Promise((resolve, reject) => {
    try {
        supabase.auth.signOut()
            .then(response => {
                if(response.error){
                    reject(response.error.message);
                }
                resolve(response);
            })
            .catch(error => reject(error))
    } catch (e) {
        
    }
})

export const resetPassword = (email) => new Promise((resolve, reject) => {
    try {
        supabase.auth.resetPasswordForEmail(email,
        { redirectTo: `${window.location.origin}/account-settings`})
            .then(response => {
                if(response.error){
                    reject(response.error.message)
                }
                resolve(response)
            })
            .catch(error => reject(error))
    } catch (e) {
        throw e
    }
})

export const setNewPassword = (newPassword) => new Promise((resolve, reject) => {
    try {
        supabase.auth.updateUser({ password: newPassword})
            .then(response => {
                if(response.error) {
                    reject(response.error.message)
                }
                resolve(response)
            })
            .catch(error => reject(error))
    } catch (e) {
        throw e
    }
})