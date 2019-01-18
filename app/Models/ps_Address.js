'use strict';

const Model = use('Model');

class ps_Address extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_address';
	}

	static get primaryKey() {
		return 'id_address';
	}

	// Relations
	customer() {
		return this.hasOne('App/Models/ps_Customer', 'id_customer', 'id_customer');
	}
}

module.exports = ps_Address;
