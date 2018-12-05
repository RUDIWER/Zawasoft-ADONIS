'use strict';

const Model = use('Model');

class SalesOrderRowBol extends Model {
	static get table() {
		return 'sales_order_rows_bol';
	}
}

module.exports = SalesOrderRowBol;
