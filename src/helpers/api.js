import FirebaseConfig from '../config/FirebaseConfig'
/**
 * Log a user in
 *
 * @param  {String} email
 * @param  {String} password
 *
 * @return {Promise}         Resolves with { token, items, user }
 */
const login = (email, password) => new Promise((res, rej) => {
	request.post('/user/login', { email, password })
		.then(function (response) {
			if (response.status === 200) {
				res({
					token: response.data.token,
					items: response.data.items,
					user: response.data.user,
					settings: response.data.settings
				})
			} else {
				rej(response)
			}
		})
		.catch((err) => { rej(err) })
})

// Allow both types of imports:
//
// import { x } from 'api'
// import api from 'api'; api.x()
const api = {
	login
}

export {
	login
}

export default api
