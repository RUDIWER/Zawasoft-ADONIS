'use strict';

const Model = use('Model');

class SalesOrderZwd extends Model {
	// Different table name
	static get table() {
		return 'sales_orders_zwd';
	}

	// RELATIONS
	rows() {
		return this.hasMany('App/Models/SalesOrderRowZwd', 'id', 'id_sales_order_zwd');
	}
}

module.exports = SalesOrderZwd;
