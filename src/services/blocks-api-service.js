import { supabase } from "../supabase/supabaseClient.js";

export const getBlock = (block_id) => new Promise((resolve, reject) => {
    try {
        supabase.rpc('get_block', {_block_id:block_id})
        .single()
            .then(response => {
                if(response.error){
                    reject(response.error.message)
                }
                const block = response?.data?.block??{}
                Object.keys(block).forEach(key => {
                    if (block[key] === null) {
                      delete block[key];
                    }
                  });
                resolve(block)       
            })
            .catch(error => reject(error))
    } catch (e) {
        reject(e)
    }
})