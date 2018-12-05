'use strict';

const Model = use('Model');

class SalesOrderBol extends Model {
	// Different table name
	static get table() {
		return 'sales_orders_bol';
	}

	// RELATIONS
	rows() {
		return this.hasMany('App/Models/SalesOrderBolRow', 'id', 'id_sales_order_bol');
	}
}

module.exports = SalesOrderBol;
