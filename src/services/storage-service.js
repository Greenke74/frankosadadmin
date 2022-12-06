import { supabase } from "../supabase/supabaseClient";
import { v1 as uuidv1 } from 'uuid'

export const uploadImage = (file) => new Promise((resolve, reject) => {
	try {
		supabase.storage
			.from('images')
			.upload(`public/${uuidv1()}`.replaceAll('-', '_'), file, { upsert: true })
			.then(response => {
				if (response.error) {
					reject(response.error.message)
				}
				const { data: { path } } = response
				resolve(path)
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
			.remove([path])
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

export const getImageSrc = (key) => {
	const { data } = supabase.storage.from('images').getPublicUrl(key);

	return data.publicUrl;
}