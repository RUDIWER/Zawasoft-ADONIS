'use strict';

const Model = use('Model');

class ps_ProductShop extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_product_shop';
	}

	static get primaryKey() {
		return 'id_product';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}
}

module.exports = ps_ProductShop;
