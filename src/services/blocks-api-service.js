import { supabase } from "../supabase/supabaseClient.js";

export const getBlock = (block_id) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('get_block', { _block_id: block_id })
			.single()
			.then(response => {
				if (response.error) {
					reject(response.error.message)
				}
				const block = response?.data?.block ?? {}
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

export const deleteBlock = (block_id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('blocks')
			.delete()
			.eq("id", block_id)
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

export const updateBlock = (new_block) => new Promise((resolve, reject) => {
	try {
		supabase
			.rpc('update_block', { new_block })
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
