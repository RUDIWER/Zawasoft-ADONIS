'use strict';

const Model = use('Model');

class ps_CategoryShop extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_category_shop';
	}

	static get primaryKey() {
		return 'id_category';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_CategoryShop;
