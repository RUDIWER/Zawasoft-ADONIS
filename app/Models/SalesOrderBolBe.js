'use strict';

const Model = use('Model');

class SalesOrderBolBe extends Model {
	// Different table name
	static get table() {
		return 'sales_orders_bol_be';
	}

	// RELATIONS
	rows() {
		return this.hasMany('App/Models/SalesOrderBolBeRow', 'id', 'id_sales_order_bol_be');
	}
}

module.exports = SalesOrderBolBe;
