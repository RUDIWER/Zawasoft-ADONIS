'use strict';

const Model = use('Model');

class SalesInvoice extends Model {
	// DATE REFORMATTING
	static get dates() {
		return super.dates.concat([ 'invoice_date' ]);
	}

	static castDates(field, value) {
		if (field === 'invoice_date') {
			if (value) {
				return value.format('YYYY-MM-DD');
			}
		}
		return super.formatDates(field, value);
	}
	// RELATIONS
	rows() {
		return this.hasMany('App/Models/SalesInvoiceRow', 'id', 'id_invoice');
	}
}

module.exports = SalesInvoice;
