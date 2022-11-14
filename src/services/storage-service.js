import { supabase } from "../supabase/supabaseClient";


export const uploadImage = (file) => new Promise((resolve, reject) => {
    try {
        supabase.storage
        .from('images')
        .upload("public/" + file?.name, file, { upsert: true })
        .then(response => {
            if (response.error) {
                reject(response.error.message)
            }
            const { data: { path } } = response
            resolve(supabase.storage.from('images').getPublicUrl(path).data.publicUrl)
        })
        .catch(error => reject(error))
    } catch (e) {
        reject(e)
    }
})

export const deleteImage = (path) => new Promise((resolve, reject) => {
    try {
        supabase.storage
        .from('images')
        .remove(path)
        .then(response => {
            if (response.error) {
                reject(response.error.message)
            }
            resolve(response)
        })
        .catch(error => reject(error))
    } catch (e) {
        reject(e)
    }
})