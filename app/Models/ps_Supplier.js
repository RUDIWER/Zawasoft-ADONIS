'use strict';

const Model = use('Model');

class ps_Supplier extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_supplier';
	}

	static get primaryKey() {
		return 'id_supplier';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}
}

module.exports = ps_Supplier;
