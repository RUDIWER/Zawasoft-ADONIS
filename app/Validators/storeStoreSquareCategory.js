const antl = use('Antl');

('use strict');

class storeStoreSquareCategory {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			name_nl: 'required|max:50',
			id_storesquare: 'required|not_equals:0',
			cost_fix: 'required|not_equals:0',
			cost_procent: 'required|not_equals:0',
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

module.exports = storeStoreSquareCategory;
