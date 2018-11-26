'use strict';

const Model = use('Model');

class OldCustomer extends Model {
	static get primaryKey() {
		return 'id_customer';
	}
}

module.exports = OldCustomer;
