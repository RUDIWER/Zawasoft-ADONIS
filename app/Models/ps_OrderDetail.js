'use strict';

const Model = use('Model');

class ps_OrderDetail extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_order_detail';
	}

	static get primaryKey() {
		return 'id_order_detail';
	}

	// RELATIONS
	product() {
		return this.hasOne('App/Models/ps_Product', 'id_product', 'id_product');
	}
}

module.exports = ps_OrderDetail;
