// Validation file for Sales Invoice


const antl = use('Antl');
('use strict');

class storeSalesInvoice {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			id_customer : 'required|not_equals:0',
			id_invoice_type : 'required|not_equals:0'
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

module.exports = storeSalesInvoice;
