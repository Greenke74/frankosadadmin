import { supabase } from "../supabase/supabaseClient.js";

export const getPages = async () => {
    const {data, error} = await supabase
    .from('pages')
    .select('id, name, value')
    if(error) {
        throw error
    }
    return {data: data.reduce((result, field) => ({...result, [field.name]: field.value}), {}), 
    fields: data.map(f=>({id: f.id, name: f.name}))} 
}

export const updatePages = async (newPages) => {
    const {data, error} = await supabase
        .from('pages')
        .upsert(newPages)
    if (error) {
        throw error
    }
}