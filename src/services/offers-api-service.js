import { supabase } from "../supabase/supabaseClient";

export const getOffer = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('offers')
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

export const getOffers = () => new Promise((resolve, reject) => {
	try {
		supabase
			.from('offers')
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

export const getOfferWithBlocks = (id) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('get_offer_with_blocks', {_id:id})
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

export const insertOffer = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('insert_offer', data)
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

export const updateOffer = (data) => new Promise((resolve, reject) => {
	try {
		supabase.rpc('update_offer', data)
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

export const deleteOffer = (id) => new Promise((resolve, reject) => {
	try {
		supabase
			.from('offers')
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