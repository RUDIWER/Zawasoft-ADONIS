'use strict';

const User = use('App/Models/User');

class RegisterController {
	showRegisterForm({ view }) {
		return view.render('auth.register');
	}

	async register({ request, session, response, antl, auth }) {
		// Create user
		const user = await User.create({
			username: request.input('username'),
			email: request.input('email'),
			password: request.input('password'),
			is_active: true,
			is_admin: false
		});

		// Login new user
		await auth.login(user);
		session.flash({
			notification: {
				type: 'warning',
				message: antl.formatMessage('messages.no_profile')
			}
		});
		return response.redirect('/profile/create');
	}
}

module.exports = RegisterController;
