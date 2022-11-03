import { supabase } from "../supabase/supabaseClient.js";

export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session??null
}

export const login = async (credentails) => new Promise((resolve, reject) => {
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

export const logout = async () => new Promise((resolve, reject) => {
    try {
        supabase.auth.signOut()
            .then(response => {
                console.log(response);
                resolve(response);
            })
    } catch (e) {
        
    }
})