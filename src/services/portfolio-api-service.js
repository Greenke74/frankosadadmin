import { supabase } from "../supabase/supabaseClient.js";

export const getCompletedProjects = () => new Promise((resolve, reject) => {
	try {
		supabase
			.from('completed_projects')
			.select('*')
			.then(({ data, error }) => {
				if(error){
					reject(error);
				}
				resolve(data);
			})
	} catch (e) {
		reject(e)
	}
})

export const getCompletedProject = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('completed_projects')
			.select('*')
			.eq('id', id)
			.single()
			.then(({ data, error }) => {
				if(error){
					reject(error);
				}
				resolve(data);
			})
	} catch (e) {
		reject(e)
	}
})