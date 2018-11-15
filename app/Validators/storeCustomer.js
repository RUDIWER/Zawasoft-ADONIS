// Validation file for editing existing customer without add. address fields

const antl = use('Antl');
('use strict');

class storeCustomer {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			first_name: 'required|max:50',
			last_name: 'required|max:50',
			email_1: 'required|email|max:60',
			email_2: 'email|max:60',
			vat_number: 'max:60',
			bank_account: 'max:60',
			website: 'max:80',
			company: 'max:50',
			phone_1: 'max:50',
			phone_2: 'max:50',
			phone_3: 'max:50',
			phone_descr_1: 'max:50',
			phone_descr_2: 'max:50',
			phone_descr_3: 'max:50',
			id_title: 'not_equals:0',
			id_type: 'not_equals:0',
			id_origin: 'not_equals:0',
			id_lang: 'not_equals:0'
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

module.exports = storeCustomer;
