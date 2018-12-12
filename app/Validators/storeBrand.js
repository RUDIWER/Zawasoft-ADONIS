const antl = use('Antl');

('use strict');

class storeBrand {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			name_nl: 'required|max:50',
			meta_title: 'alpha|max:128',
			meta_keywords: 'max:255',
			meta_description: 'alpha|max:255',
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

module.exports = storeBrand;
