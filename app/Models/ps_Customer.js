'use strict';

const Model = use('Model');

class ps_Customer extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_customer';
	}

	static get primaryKey() {
		return 'id_customer';
	}
}

module.exports = ps_Customer;
