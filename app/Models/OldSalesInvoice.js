'use strict';

const Model = use('Model');

class OldSalesInvoice extends Model {
	static get table() {
		return 'old_sales_invoice';
	}

	static get primaryKey() {
		return 'id_cz_cust_invoice';
	}
}

module.exports = OldSalesInvoice;
