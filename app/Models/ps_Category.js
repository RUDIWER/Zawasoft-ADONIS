'use strict';

const Model = use('Model');

class ps_Category extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_category';
	}

	static get primaryKey() {
		return 'id_category';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}
}

module.exports = ps_Category;
