const antl = use('Antl');

('use strict');

class storeProduct {
	get validateAll() {
		return true;
	}

	get sanitizationRules() {
		return {
			margin_factor_cz_web_be: 'to_null',
			margin_factor_cz_web_nl: 'to_null',
			netto_profit_amount_cz_be: 'to_null',
			netto_profit_amount_cz_nl: 'to_null',
			margin_factor_dropshipping: 'to_null',
			margin_factor_wholesale: 'to_null',
			vat_procent: 'to_null',
			margin_factor_bol_be: 'to_null',
			margin_factor_bol_nl: 'to_null',
			shipping_cost_ex_vat_bol_be: 'to_null',
			shipping_cost_ex_vat_bol_nl: 'to_null',
			total_cost_ex_vat_bol_be: 'to_null',
			netto_profit_amount_bol_nl: 'to_null',
			netto_profit_amount_bol_be: 'to_null',
			total_cost_ex_vat_bol_nl: 'to_null',
			stock_start: 'to_null',
			stock_real: 'to_null',
			stock_accounting: 'to_null'
		};
	}

	get rules() {
		const productId = this.ctx.params.id;
		return {
			name_nl: 'required|max:80',
			name_fr: 'max:80',
			name_en: 'max:80',
			meta_descr_nl: 'max:160',
			meta_title_nl: 'max:70',
			descr_short_nl: 'max:1000',
			descr_long_nl: 'max:4000',
			meta_keywords_nl: 'max:255',
			meta_descr_fr: 'max:160',
			meta_title_fr: 'max:70',
			descr_short_fr: 'max:400',
			descr_long_fr: 'max:800',
			meta_descr_en: 'max:160',
			meta_title_en: 'max:70',
			descr_short_en: 'max:400',
			descr_long_en: 'max:800',
			stock_place_1: 'max:20',
			stock_place_2: 'max:20',
			stock_place_3: 'max:20',
			stock_place_4: 'max:20',
			slug_nl: `required|unique:products,slug_nl,id,${productId}`, // Backticks !!!
			id_supplier: 'not_equals:0',
			id_bol_category: 'required',
			id_product_supplier: 'max:20',
			ean13: `unique:products,ean13,id,${productId}|required_if:active_bol_be|required_if:active_bol_nl|max:20`
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

module.exports = storeProduct;
