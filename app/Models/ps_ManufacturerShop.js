'use strict';

const Model = use('Model');

class ps_ManufacturerShop extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_manufacturer_shop';
	}

	static get primaryKey() {
		return 'id_manufacturer';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_ManufacturerShop;
