'use strict';

const Model = use('Model');

class ps_Order extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_orders';
	}

	static get primaryKey() {
		return 'id_order';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}

	// RELATIONS
	rows() {
		return this.hasMany('App/Models/ps_OrderDetail', 'id_order', 'id_order');
	}

	customer() {
		return this.hasOne('App/Models/ps_Customer', 'id_customer', 'id_customer');
	}

	AddrDelivery() {
		return this.hasOne('App/Models/ps_Address', 'id_address_delivery', 'id_address');
	}

	AddrInvoice() {
		return this.hasOne('App/Models/ps_Address', 'id_address_invoice', 'id_address');
	}
}

module.exports = ps_Order;
