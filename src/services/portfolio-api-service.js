import { supabase } from "../supabase/supabaseClient.js";

export const getProjects = () => new Promise((resolve, reject) => {
	try {
		supabase
			.from('projects')
			.select('*')
			.then(({ data, error }) => {
				if (error) {
					reject(error);
				}
				resolve(data);
			})
	} catch (e) {
		reject(e)
	}
})

export const getProject = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('projects')
			.select()
			.eq('id', id)
			.then(({ data, error }) => {
				if (error) {
					reject(error);
				}
				resolve(data);
			})
	} catch (e) {
		reject(e)
	}
})

export const getProjectPage = (value) => new Promise((resolve, reject) => {
	try {
		supabase
		.rpc(
			isNaN(value) && typeof(value) == 'string' ? 'get_project_page_by_alias' : 'get_project_page_by_id', 
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

export const insertProject = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('insert_project', data)
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

export const updateProject = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('update_project', data)
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

export const deleteProject = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('projects')
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

export const selectProjects = (params) => new Promise((resolve, reject) => {
	try {
		supabase.rpc(params.typeFilter != null ? 'select_projects_with_filters' : 'select_projects', params)
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