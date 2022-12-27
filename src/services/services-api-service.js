import { supabase } from "../supabase/supabaseClient";

export const getService = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('services')
			.select()
			.eq('id', id)
			.then(({ data, error }) => {
				if (error) {
					reject(error);
				}
				resolve(data);
			})
			.catch(error => reject(error))
	} catch (e) {
		reject(e)
	}
})

export const getServices = () => new Promise((resolve, reject) => {
	try {
		supabase
			.from('services')
			.select()
			.then(({ data, error }) => {
				if (error) {
					reject(error);
				}
				resolve(data);
			})
			.catch(error => reject(error))
	} catch (e) {
		reject(e)
	}
})

export const getServicePage = (value) => new Promise((resolve, reject) => {
	try {
		supabase
		.rpc(
			isNaN(value) && typeof(value) == 'string' ? 'get_service_page_by_alias' : 'get_service_page_by_id', 
			isNaN(value) && typeof(value) == 'string' ? {_alias: value} : {_id: value})
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

export const insertService = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('insert_services', data)
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

export const updateService = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('update_service', data)
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

export const deleteService = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('services')
			.delete()
			.eq('id', id)
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