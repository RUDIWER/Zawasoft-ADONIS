const antl = use('Antl');

('use strict');

class storeProductGroup {
	get validateAll() {
		return true;
	}

	get rules() {
		const groupId = this.ctx.params.id;
		return {
			name_nl: 'required|max:50',
			slug: `required|unique:product_groups,slug,id,${groupId}`, // Backticks !!!
			meta_title: 'alpha|max:128',
			meta_keywords: 'max:255',
			meta_description: 'alpha|max:255'
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

module.exports = storeProductGroup;
