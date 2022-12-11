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

export const getProjectWithBlocksById = (id) => new Promise((resolve, reject) => {
	try {

		supabase.rpc('get_project_with_blocks_by_id', {_id: id})
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

export const getProjectWithBlocksByAlias = (alias) => new Promise((resolve, reject) => {
	try {

		supabase.rpc('get_project_with_blocks_by_alias', {_alias: alias})
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