import { supabase } from "../supabase/supabaseClient"

export const getMainPageBlock = (id) => new Promise((resolve, reject) => {
    try {
        supabase.rpc('get_main_page_block', { _id: id })
            .then(response => {
                if (response.error) {
                    reject(response)
                }
                resolve(response)
            })
            .catch(error => reject(error))

    } catch (e) {
        reject(e)
    }
})

export const getMainPageBlocks = () => new Promise((resolve, reject) => {
    try {
        supabase.rpc('get_main_page_blocks')
            .then(response => {
                if (response.error) {
                    reject(response)
                }

                resolve(response)
            })
            .catch(error => reject(error))

    } catch (e) {
        reject(e)
    }
})

export const updateMainPageBlock = (data) => new Promise((resolve, reject) => {
    if (data.projects) {
        delete data.projects;
    }
    if (data.offers) {
        delete data.offers;
    }
    if (data.services) {
        delete data.services;
    }
    
    try {
        supabase.rpc('update_main_page_block', data)
            .then(response => {
                if (response.error) {
                    reject(response)
                }

                resolve(response)
            })
            .catch(error => reject(error))

    } catch (e) {
        reject(e)
    }
})

export const insertMainPageBlock = (data) => new Promise((resolve, reject) => {
    try {
        supabase.rpc('insert_main_page_block', data)
            .then(response => {
                if (response.error) {
                    reject(response)
                }

                resolve(response)
            })
            .catch(error => reject(error))

    } catch (e) {
        reject(e)
    }
})

export const deleteMainPageBlock = (id) => new Promise((resolve, reject) => {
    try {
        supabase
            .from('main_page_blocks')
            .delete()
            .eq('id', id)
            .then(response => {
                if (response.error) {
                    reject(response)
                }

                resolve(response)
            })
            .catch(error => reject(error))

    } catch (e) {
        reject(e)
    }
})


