'use strict';

const Model = use('Model');

class ps_CategoryProduct extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_category_product';
	}

	static get primaryKey() {
		return 'PRIMARY KEY';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_CategoryProduct;
