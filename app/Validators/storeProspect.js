// Validation file for editing existing customer without add. address fields

const antl = use('Antl');
('use strict');

class storeProspect {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			first_name: 'required|max:50',
			last_name: 'required|max:50',
			email: 'required|email|max:60',
			website: 'max:80',
			company: 'max:50',
			phone: 'max:50',
			mobile: 'max:50',
			id_title: 'not_equals:0',
			id_type: 'not_equals:0',
			id_lang: 'not_equals:0',
			street: 'max:50',
			number: 'max:10',
			bus: 'max:10',
			postcode: 'max:20',
			city: 'max:50',
			state: 'max:50',
			country: 'max:50'
		};
	}

	get messages() {
		const locale = this.ctx.antl._locale;
		const messages = antl.forLocale(locale).list('validators');
		return messages;
	}

	async fails(errorMessages) {
		const locale = this.ctx.antl._locale;
		this.ctx.session.withErrors(errorMessages).flashAll();
		this.ctx.session.flash({
			notification: {
				type: 'danger',
				message: antl.forLocale(locale).formatMessage('messages.validation_nok')
			}
		});
		return this.ctx.response.redirect('back');
	}
}

module.exports = storeProspect;
