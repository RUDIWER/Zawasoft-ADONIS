const antl = use('Antl');
('use strict');

class storeParam {
	get validateAll() {
		return true;
	}

	get rules() {
		return {
			shipping_cost_ex_vat_cz_be: 'required|number',
			shipping_cost_ex_vat_cz_nl: 'required|number',
			shipping_cost_ex_vat_bol_be: 'required|number',
			return_cost_ex_vat_bol_be: 'required|number',
			return_cost_ex_vat_bol_be: 'required|number',
			shipping_cost_ex_vat_bol_nl: 'required|number',
			min_order_amount_in_vat_free_shipping: 'required|number',
			fix_cost_ex_vat_bol: 'required:number',
			stand_cost_procent_bol: 'required|number',
			stand_vat_procent: 'required|number',
			stand_shipping_vat_procent: 'required|number',
			stand_margin_dropshipping: 'required|number',
			stand_margin_wholesale: 'required|number',
			last_sales_invoice_nr: 'required|number'
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

module.exports = storeParam;
