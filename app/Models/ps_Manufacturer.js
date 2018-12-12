'use strict';

const Model = use('Model');

class ps_Manufacturer extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_manufacturer';
	}

	static get primaryKey() {
		return 'id_manufacturer';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}
}

module.exports = ps_Manufacturer;
