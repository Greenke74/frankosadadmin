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

export const getPageBlocks = (pageName) => new Promise((resolve, reject) => {
    try {
        supabase
        .from('pages')
        .select('id, name, page_blocks ( id, block_id )')
        .eq('name', pageName)
        .single()
        .then(response => {
            if(response.error){
                reject(response.error.message)
            }
            const {data} = response
            resolve({id: data.id, name: data.name, blocks: data.page_blocks.map(b=>b.block_id)})    
        })
        .catch(error => reject(error))
        

    } catch (e) {
        reject(e)
    }
})