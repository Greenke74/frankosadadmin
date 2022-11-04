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

export const resetPassword = async (email) => new Promise((resolve, reject) => {
    try {
        supabase.auth.resetPasswordForEmail(email,
        { redirectTo: `${window.location.origin}/setnewpassword`})
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

export const setNewPassword = async (newPassword) => new Promise((resolve, reject) => {
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