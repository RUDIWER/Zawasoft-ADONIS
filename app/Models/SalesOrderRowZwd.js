'use strict';

const Model = use('Model');

class SalesOrderRowZwd extends Model {
	static get table() {
		return 'sales_order_rows_zwd';
	}
}

module.exports = SalesOrderRowZwd;
