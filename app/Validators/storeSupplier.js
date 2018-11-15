// Validation file for editing existing customer without add. address fields

const antl = use('Antl');
('use strict');

class storeSupplier {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			company: 'required|max:50',
			website: 'max:80',
			email_1: 'email|max:60',
			email_2: 'email|max:60',
			email_1_descr: 'max:50',
			email_2_descr: 'max:50',
			vat_number: 'max:30',
			bank_account: 'max:30',
			website: 'max:80',
			phone_1: 'max:20',
			phone_2: 'max:20',
			phone_3: 'max:20',
			phone_descr_1: 'max:50',
			phone_descr_2: 'max:50',
			phone_descr_3: 'max:50',
			contact_1: 'max:50',
			contact_2: 'max:50',
			country: 'max:50',
			state: 'max:50',
			postcode: 'max:20',
			street: 'max:50',
			number: 'max:10',
			bus: 'max:10',
			city: 'max:50',
			memo: 'max:100'
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

module.exports = storeSupplier;
