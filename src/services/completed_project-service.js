import { supabase } from "../supabase/supabaseClient.js";

export const insertCompletedProject = (data) => new Promise((resolve, reject) => {
    try {
        supabase.rpc('insert_completed_project', data)
        .then(response => {
            if(response.error) {
                reject(response.error.message)
            }
            resolve(response)
        })
        .catch(error => reject(error))
    } catch (e) {
        reject(e)
    }
})