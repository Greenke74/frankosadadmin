import { supabase } from "../supabase/supabaseClient.js";

export const getMainSettings = async () => {
    const { data, error } = await supabase
        .from('mainSettings')
        .select('id, name, value')
    if(error) {
        throw error
    }
    return {data: data.reduce((result, field) => ({...result, [field.name]: field.value}), {}), fields: data.map(f=>({id: f.id, name: f.name}))} 
}

export const updateMainSettings = async (newMainSettings) => {
    const {data, error} = await supabase
        .from('mainSettings')
        .upsert(newMainSettings)
    if (error) {
        throw error
    }
}









