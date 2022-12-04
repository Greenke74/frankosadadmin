import { supabase } from "../supabase/supabaseClient.js";

export const insertBlock = (data) => new Promise((resolve, reject) => {
  try {
    supabase
      .rpc('insert_block', data)
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

export const deleteBlock = (id) => new Promise((resolve, reject) => {
  try {
    supabase
      .from('blocks')
      .delete()
      .eq("id", id)
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

export const updateBlock = (data) => new Promise((resolve, reject) => {
  try {
    supabase
      .rpc('update_block', data)
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