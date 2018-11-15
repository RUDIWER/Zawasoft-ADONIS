'use strict';

const Model = use('Model');

class SalesOrderBolBeRow extends Model {
	static get table() {
		return 'sales_orders_bol_be_rows';
	}
}

module.exports = SalesOrderBolBeRow;
