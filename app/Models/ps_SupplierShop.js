'use strict';

const Model = use('Model');

class ps_SupplierShop extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_supplier_shop';
	}

	static get primaryKey() {
		return 'id_supplier';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_SupplierShop;
