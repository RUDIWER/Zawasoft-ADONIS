'use strict';

const Model = use('Model');

class OldSalesInvoiceDetail extends Model {
	static get table() {
		return 'old_sales_invoice_detail';
	}

	static get primaryKey() {
		return 'id_cz_cust_invoice_detail';
	}
}

module.exports = OldSalesInvoiceDetail;
